export function logout() {
  localStorage.removeItem('token');
  window.location.href = '/signin';
}
export function isLoggedIn(): boolean {
  return Boolean(localStorage.getItem('token'));
}
export async function register({ email, password }: { email: string; password: string }) {
  const response = await axios.post('https://authgen.azurewebsites.net/signup', {
    username: email,
    password,
  });
  return response.data;
}
import axios from 'axios';

export async function login({ email, password }: { email: string; password: string }) {
  const response = await axios.post('https://authgen.azurewebsites.net/login', {
    username: email,
    password,
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
