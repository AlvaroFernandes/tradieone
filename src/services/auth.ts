import axios from 'axios';
import { AUTH_ENDPOINTS } from "../config/auth"

/**
 * Log out the current user.
 * - Optionally notify the server (if a logout endpoint exists).
 * - Clear local auth state (token).
 * - Redirect to the sign-in page.
 */
export async function logout(): Promise<void> {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      // If your backend supports a logout endpoint to invalidate the token,
      // you can uncomment and update the request below. Keep it best-effort
      // so logout never fails client-side.
      // await axios.post(AUTH_ENDPOINTS.logout, {}, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
    }
  } catch (err) {
    // Non-fatal: log and continue to clear client state
    console.error('Logout request failed', err);
  } finally {
    localStorage.removeItem('token');
    // Do not remove remembered email on logout automatically.
    // Redirect to sign-in route.
    window.location.href = '/signin';
  }
}

export function isLoggedIn(): boolean {
  return Boolean(localStorage.getItem('token'));
}

export async function register({ email, password }: { email: string; password: string }) {
  const response = await axios.post(AUTH_ENDPOINTS.signup, {
    username: email,
    password,
  });
  return response.data;
}

export async function login({ email, password }: { email: string; password: string }) {
  const response = await axios.post(AUTH_ENDPOINTS.login, {
    username: email,
    password,
  });
  return response.data;
}

export async function requestPasswordReset(email: string) {
  // Sends a password reset request to the auth backend.
  // If your backend uses a different endpoint or payload, update accordingly.
  const response = await axios.post(AUTH_ENDPOINTS.forgotPassword, {
    username: email,
  });
  return response.data;
}

export function rememberEmail(email: string) {
  localStorage.setItem('rememberedEmail', email);
}

export function forgetRememberedEmail() {
  localStorage.removeItem('rememberedEmail');
}

export function getRememberedEmail(): string {
  return localStorage.getItem('rememberedEmail') || '';
}


