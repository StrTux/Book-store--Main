import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, logoutUser, fetchUserProfile, clearState, setUser } from '../redux/slices/userSlice';
import api from '../services/axiosConfig';
import { handleApiError } from '../utils/errorHandler';
import { AUTH_ENDPOINTS } from '../config/api';

export function useAuth() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshAttempted, setRefreshAttempted] = useState(false);
  
  const login = async (credentials) => {
    try {
      // Use configured API endpoint
      const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Update Redux state with user data from API
      dispatch(setUser(data.user));
      
      // Store login timestamp for 30-day expiration
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30); // 30 days from now
      
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('loginExpiry', expiryDate.toISOString());
      
      return { success: true, user: data.user };
    } catch (error) {
      const errorMessage = error.message || 'Login failed';
      return { success: false, error: errorMessage };
    }
  };
  
  const logout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      // Clear all auth-related items from localStorage
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('loginExpiry');
      sessionStorage.removeItem('lastRefreshAttempt');
      return { success: true };
    } catch (error) {
      // If the server-side logout fails, still clear local state
      dispatch(clearState());
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('loginExpiry');
      sessionStorage.removeItem('lastRefreshAttempt');
      const errorDetails = handleApiError(error, 'logout');
      return { success: false, error: errorDetails.message };
    }
  };
  
  const getProfile = async () => {
    try {
      setRefreshing(true);
      const userData = await dispatch(fetchUserProfile()).unwrap();
      if (userData) {
        localStorage.setItem('isLoggedIn', 'true');
      }
      return { success: true, user: userData };
    } catch (error) {
      console.log('Failed to fetch profile:', error);
      // Only clear logged-in state if the refresh token is invalid
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('loginExpiry');
        dispatch(clearState());
      }
      const errorDetails = handleApiError(error, 'getProfile');
      return { success: false, error: errorDetails.message };
    } finally {
      setRefreshing(false);
    }
  };

  const refreshToken = async () => {
    // Prevent multiple refresh attempts in a short period
    const now = new Date().getTime();
    const lastAttempt = sessionStorage.getItem('lastRefreshAttempt');
    
    if (lastAttempt && now - parseInt(lastAttempt) < 5000) { // 5 seconds minimum between attempts
      console.log('Skipping refresh - too soon since last attempt');
      return { success: false, error: 'Too many refresh attempts' };
    }
    
    sessionStorage.setItem('lastRefreshAttempt', now.toString());
    
    try {
      setRefreshing(true);
      const response = await fetch(AUTH_ENDPOINTS.REFRESH_TOKEN, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to refresh token');
      }
      
      if (data && data.user) {
        // Update Redux state with the user data
        dispatch(setUser(data.user));
        
        // Update login expiry
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30); // 30 days from now
        localStorage.setItem('loginExpiry', expiryDate.toISOString());
        
        return { success: true, user: data.user };
      }
      return { success: false, error: 'No user data in refresh response' };
    } catch (error) {
      console.log('Failed to refresh token:', error);
      
      // Clear user state on refresh token failure
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('loginExpiry');
      dispatch(clearState());
      
      const errorMessage = error.message || 'Failed to refresh token';
      return { success: false, error: errorMessage };
    } finally {
      setRefreshing(false);
      setRefreshAttempted(true);
    }
  };
  
  // Check for login expiry
  const checkLoginExpiry = () => {
    const expiryStr = localStorage.getItem('loginExpiry');
    if (!expiryStr) return false;
    
    try {
      const expiryDate = new Date(expiryStr);
      return new Date() < expiryDate;
    } catch (e) {
      console.error('Error parsing login expiry date:', e);
      return false;
    }
  };
  
  const isAuthenticated = !!user;
  
  useEffect(() => {
    // Check if user was previously logged in and login hasn't expired
    const wasLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const loginValid = checkLoginExpiry();
    
    if (wasLoggedIn && loginValid && !user && !refreshing && !refreshAttempted) {
      // Try to restore user session
      console.log('Attempting to restore session...');
      refreshToken();
    } else if (wasLoggedIn && !loginValid) {
      // Login expired, clear state
      console.log('Login expired, logging out...');
      dispatch(clearState());
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('loginExpiry');
    }
  }, [user, refreshAttempted]);
  
  // Listen for auth:refresh events from axiosConfig.js
  useEffect(() => {
    const handleAuthRefresh = (event) => {
      const userData = event.detail?.user;
      if (userData) {
        console.log('Received auth:refresh event, updating user data');
        dispatch(setUser(userData));
      }
    };
    
    window.addEventListener('auth:refresh', handleAuthRefresh);
    
    // Also check for user data in localStorage (alternative update method)
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser && !user) {
      try {
        const userData = JSON.parse(storedUser);
        dispatch(setUser(userData));
      } catch (e) {
        console.error('Error parsing stored user data:', e);
      }
    }
    
    return () => {
      window.removeEventListener('auth:refresh', handleAuthRefresh);
    };
  }, [dispatch]);
  
  return {
    user,
    loading,
    error,
    login,
    logout,
    getProfile,
    refreshToken,
    isAuthenticated
  };
} 