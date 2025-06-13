/**
 * API Configuration
 * 
 * This file contains the configuration for the API endpoints.
 * The API_BASE_URL is read from the environment variables.
 * 
 * To update the API URL:
 * 1. Edit the .env file to update VITE_API_URL
 * 2. Restart the development server
 */

// Base URL for all API requests
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-backend-api.vercel.app';

// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  SIGNUP: `${API_BASE_URL}/auth/signup`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/refreshToken`,
  PROFILE: `${API_BASE_URL}/auth/me`,
};

// Other API endpoints can be added here
export const API_ENDPOINTS = {
  // Products
  PRODUCTS: `${API_BASE_URL}/products`,
  // Cart
  CART: `${API_BASE_URL}/cart`,
  // Orders
  ORDERS: `${API_BASE_URL}/orders`,
};

export default {
  API_BASE_URL,
  AUTH_ENDPOINTS,
  API_ENDPOINTS,
}; 