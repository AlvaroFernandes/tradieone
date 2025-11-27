import apiClient from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/config/config';

export interface Client {
  clientName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postcode: string;
  id?: string | number;
}

export interface GetClientsOptions {
  pageNumber?: number;
  pageSize?: number;
  keyword?: string;
}

export async function getClients(options: GetClientsOptions = {}) {
  const { pageNumber = 1, pageSize = 20, keyword = '' } = options;
  const response = await apiClient.get(API_ENDPOINTS.clients.list, {
    params: {
      pageNumber,
      pageSize,
      keyword,
    },
  });
  return response.data;
}

export async function getClientById(id: string | number) {
  const response = await apiClient.get(API_ENDPOINTS.clients.clientDetail(String(id)));
  return response.data;
}

export async function createClient(data: Client) {
  const response = await apiClient.post(API_ENDPOINTS.clients.addClient, data);
  return response.data;
}

export async function updateClient(id: string | number, data: Client) {
  const response = await apiClient.put(API_ENDPOINTS.clients.updateClient(String(id)), data);
  return response.data;
}

export async function deleteClient(id: string | number) {
  const response = await apiClient.delete(API_ENDPOINTS.clients.deleteClient(String(id)));
  return response.data;
}

