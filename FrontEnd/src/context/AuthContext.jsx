import { createContext, useState, useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AUTH_ENDPOINTS } from '../config/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { user, isAuthenticated, login, logout } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const navigate = useNavigate();
  
  // Function to handle login
  const handleLogin = async (credentials) => {
    const result = await login(credentials);
    if (result.success) {
      navigate('/home');
      return { success: true };
    }
    return { success: false, error: result.error };
  };
  
  // Function to handle signup - Using your deployed backend URL
  const handleSignup = async (userData) => {
    try {
      const response = await fetch(AUTH_ENDPOINTS.SIGNUP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }
      
      // After successful signup, log the user in
      await handleLogin({ email: userData.email, password: userData.password });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  // Handle 4-minute timer for login prompt
  useEffect(() => {
    let timer;
    
    // If user is not authenticated and they're on the home page, start the timer
    if (!isAuthenticated && window.location.pathname === '/home') {
      timer = setTimeout(() => {
        setShowLoginPrompt(true);
      }, 4 * 60 * 1000); // 4 minutes
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isAuthenticated, window.location.pathname]);
  
  // Clear login prompt when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      setShowLoginPrompt(false);
    }
  }, [isAuthenticated]);
  
  const closeLoginPrompt = () => {
    setShowLoginPrompt(false);
  };
  
  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login: handleLogin,
      signup: handleSignup,
      logout,
      showLoginPrompt,
      closeLoginPrompt
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}; 