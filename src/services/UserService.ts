import apiClient from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/config/config';

export interface UserProfile {
  id?: string | number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
}

export async function getProfile(): Promise<UserProfile> {
  const response = await apiClient.get(API_ENDPOINTS.users.profile);
  return response.data;
}

export async function updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
  const response = await apiClient.put(API_ENDPOINTS.users.updateProfile, data);
  return response.data;
}