import axios from 'axios';
import { API_ENDPOINTS } from '@/config/config';

export interface UserProfile {
  id?: string | number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
}

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

export async function getProfile(): Promise<UserProfile> {
  const response = await axios.get(API_ENDPOINTS.users.profile, {
    headers: authHeaders(),
  });
  return response.data;
}

export async function updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
  const response = await axios.put(API_ENDPOINTS.users.updateProfile, data, {
    headers: authHeaders(),
  });
  return response.data;
}

export async function addUserInfo(data: Partial<UserProfile>): Promise<UserProfile> {
    const response = await axios.post(API_ENDPOINTS.users.addUserInfo, data, {
      headers: authHeaders(),
    });
    return response.data;
}