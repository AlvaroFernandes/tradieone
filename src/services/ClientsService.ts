import axios from "axios";

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

export async function createClient(data: Client) {
  // Replace with your actual API endpoint
  const response = await axios.post("/api/clients", data);
  return response.data;
}

export async function updateClient(id: string | number, data: Client) {
  // Replace with your actual API endpoint
  const response = await axios.put(`/api/clients/${id}`, data);
  return response.data;
}
