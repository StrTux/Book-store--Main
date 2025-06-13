/**
 * Centralized error handling utility for API errors
 * Provides consistent error handling across the application
 */

// Format error messages for user display
export const formatErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred';
  
  // Handle axios errors
  if (error.response) {
    const { status, data } = error.response;
    
    // Handle specific status codes
    if (status === 401) {
      if (data.code === 'TOKEN_EXPIRED') {
        return 'Your session has expired. Please sign in again.';
      }
      return 'Authentication required. Please sign in.';
    }
    
    if (status === 403) {
      return 'You do not have permission to perform this action.';
    }
    
    if (status === 404) {
      return 'The requested resource was not found.';
    }
    
    if (status === 422 || status === 400) {
      return data.message || 'Invalid input. Please check your data.';
    }
    
    if (status >= 500) {
      return 'Server error. Please try again later.';
    }
    
    // Return the message from the API if available
    return data.message || `Error: ${status}`;
  }
  
  // Handle network errors
  if (error.request) {
    return 'Network error. Please check your internet connection.';
  }
  
  // Handle other errors
  return error.message || 'An unexpected error occurred';
};

// Log errors to console (could be extended to log to a service)
export const logError = (error, context = '') => {
  console.error(`Error${context ? ` in ${context}` : ''}:`, error);
  
  // Here you could add additional logging to a service like Sentry
};

// Handle API errors with standardized approach
export const handleApiError = (error, context = '') => {
  logError(error, context);
  return {
    message: formatErrorMessage(error),
    originalError: error
  };
};

// Helper to safely extract data from responses
export const extractResponseData = (response, defaultValue = null) => {
  if (!response || !response.data) return defaultValue;
  return response.data;
};

export default {
  formatErrorMessage,
  logError,
  handleApiError,
  extractResponseData
}; 