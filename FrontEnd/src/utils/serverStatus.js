import axios from 'axios';

const SERVER_URL = 'http://localhost:5000/api';
const STATUS_CACHE_KEY = 'server_status';
const STATUS_CACHE_TTL = 60 * 1000; // 1 minute

let isServerUp = null;
let lastChecked = 0;

/**
 * Check if the server is running by pinging the debug endpoint
 * @returns {Promise<boolean>} True if server is up, false otherwise
 */
export const checkServerStatus = async () => {
  const now = Date.now();
  
  // If we've checked recently, return cached result
  if (isServerUp !== null && now - lastChecked < STATUS_CACHE_TTL) {
    return isServerUp;
  }
  
  try {
    // Try to fetch the debug endpoint with a short timeout
    await axios.get(`${SERVER_URL}/debug`, { 
      timeout: 2000,
      withCredentials: true
    });
    
    // If successful, cache the result
    isServerUp = true;
    lastChecked = now;
    localStorage.setItem(STATUS_CACHE_KEY, JSON.stringify({ 
      isUp: true, 
      timestamp: now 
    }));
    
    return true;
  } catch (error) {
    console.warn('Server status check failed:', error.message);
    
    // If failed, cache the result
    isServerUp = false;
    lastChecked = now;
    localStorage.setItem(STATUS_CACHE_KEY, JSON.stringify({ 
      isUp: false, 
      timestamp: now 
    }));
    
    return false;
  }
};

/**
 * Check if API calls should use fallback data
 * @returns {boolean} True if fallback data should be used
 */
export const shouldUseFallback = async () => {
  const status = await checkServerStatus();
  return !status;
};

/**
 * Initialize the server status check on app start
 * Reads cached value from localStorage first
 */
export const initServerStatusCheck = () => {
  try {
    const cachedStatus = localStorage.getItem(STATUS_CACHE_KEY);
    if (cachedStatus) {
      const { isUp, timestamp } = JSON.parse(cachedStatus);
      const now = Date.now();
      
      // Only use cached value if recent
      if (now - timestamp < STATUS_CACHE_TTL) {
        isServerUp = isUp;
        lastChecked = timestamp;
        return;
      }
    }
  } catch (e) {
    console.error('Error reading cached server status:', e);
  }
  
  // Run initial check
  checkServerStatus();
}; 