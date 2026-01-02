// Token storage keys
const ACCESS_TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';
const TOKEN_EXPIRY_KEY = 'tokenExpiry';

// Get access token
export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

// Get refresh token
export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

// Get stored user
export const getStoredUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Store tokens and user after login
export const setTokens = (accessToken, refreshToken, user, expiresIn) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  
  // Store expiry time
  if (expiresIn) {
    const expiryTime = Date.now() + (expiresIn * 1000);
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  }
};

// Update only access token (after refresh)
export const updateAccessToken = (accessToken, expiresIn) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  
  if (expiresIn) {
    const expiryTime = Date.now() + (expiresIn * 1000);
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  }
};

// Clear all tokens (logout)
export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
};

// Check if access token is expired or about to expire (within 1 minute)
export const isTokenExpired = () => {
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!expiry) return true;
  
  // Check if expired or will expire in next 60 seconds
  return Date.now() > (parseInt(expiry) - 60000);
};

// Check if we have a valid refresh token
export const hasValidRefreshToken = () => {
  return !!getRefreshToken();
};

// Check if user is authenticated (has tokens)
export const isAuthenticated = () => {
  return !!getAccessToken() && hasValidRefreshToken();
};

// Refresh token mutex to prevent multiple simultaneous refreshes
let isRefreshing = false;
let refreshSubscribers = [];

export const setRefreshing = (value) => {
  isRefreshing = value;
};

export const getIsRefreshing = () => isRefreshing;

export const subscribeToRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

export const onRefreshSuccess = (newToken) => {
  refreshSubscribers.forEach(callback => callback(newToken));
  refreshSubscribers = [];
};

export const onRefreshFailure = (error) => {
  refreshSubscribers.forEach(callback => callback(null, error));
  refreshSubscribers = [];
};

