import axios from 'axios';
import { API_BASE_URL, AUTH_ENDPOINTS } from '../config/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // This is important for cookies to be sent with requests
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 5000 // 5 second timeout for all requests
});

// Track if we're currently refreshing the token
let isRefreshing = false;
// Store pending requests that should be retried after token refresh
let failedQueue = [];

// Process the queue of failed requests
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle timeout errors gracefully
    if (error.code === 'ECONNABORTED') {
      console.warn('Request timed out. Using fallback data if available.');
      return Promise.reject(error);
    }
    
    const originalRequest = error.config;
    
    // Check if error was due to an expired access token
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // Prevent multiple refresh token requests
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh the token with timeout to prevent hanging
        const response = await axios.post(
          AUTH_ENDPOINTS.REFRESH_TOKEN,
          {},
          { 
            withCredentials: true,
            timeout: 10000 // 10 second timeout for token refresh
          }
        );
        
        // If refresh token is successful, retry the original request
        if (response.status === 200) {
          // Also update Redux store with new user data
          if (response.data && response.data.user) {
            try {
              // Use direct imports instead of dynamic imports
              // This approach avoids path resolution issues
              const userActions = { setUser: response.data.user };
              
              // Dispatch user data to any listeners
              window.dispatchEvent(new CustomEvent('auth:refresh', {
                detail: { user: response.data.user }
              }));
              
              // Alternative way to update the user without importing the store
              localStorage.setItem('currentUser', JSON.stringify(response.data.user));
            } catch (storeError) {
              console.error('Failed to update user state:', storeError);
            }
          }
          
          processQueue(null, response.data.accessToken);
          isRefreshing = false;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh token fails, redirect to login
        console.error('Token refresh failed:', refreshError);
        processQueue(refreshError, null);
        isRefreshing = false;
        
        // Clear localStorage login data
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('loginExpiry');
        
        // Only redirect if it's a 401/403 error, not for network issues
        if (refreshError.response && 
           (refreshError.response.status === 401 || refreshError.response.status === 403)) {
          // Don't redirect if we're already on the signin page
          if (!window.location.pathname.includes('/signin')) {
            window.location.href = '/signin';
          }
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api; 