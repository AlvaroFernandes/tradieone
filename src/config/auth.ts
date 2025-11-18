/**
 * Authentication-specific API endpoints and settings
 */

export const AUTH_API_BASE = 'https://authgen.azurewebsites.net';

export const AUTH_ENDPOINTS = {
  login: `${AUTH_API_BASE}/login`,
  signup: `${AUTH_API_BASE}/signup`,
  logout: `${AUTH_API_BASE}/logout`,
  forgotPassword: `${AUTH_API_BASE}/forgot`,
} as const;
