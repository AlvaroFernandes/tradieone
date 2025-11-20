import axios from "axios";
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

export async function getClients() {
  const response = await axios.get(API_ENDPOINTS.clients.list);
  return response.data;
}

export async function getClientById(id: string | number) {
  const response = await axios.get(API_ENDPOINTS.clients.clientDetail(String(id)));
  return response.data;
}

export async function createClient(data: Client) {
  const response = await axios.post(API_ENDPOINTS.clients.addClient, data);
  return response.data;
}

export async function updateClient(id: string | number, data: Client) {
  const response = await axios.put(API_ENDPOINTS.clients.updateClient(String(id)), data);
  return response.data;
}

export async function deleteClient(id: string | number) {
  const response = await axios.delete(API_ENDPOINTS.clients.deleteClient(String(id)));
  return response.data;
}

