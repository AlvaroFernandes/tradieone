import apiClient from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/config/config";

export interface Contractor {
  id?: string | number;
  contractorName: string;
  contactPerson: string;
  email: string;
  phone: string;
  trade?: string;
  status?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postcode?: string;
}

export interface GetContractorsOptions {
  pageNumber?: number;
  pageSize?: number;
  keyword?: string;
}

export async function getContractors(options: GetContractorsOptions = {}) {
  const { pageNumber = 1, pageSize = 20, keyword = "" } = options;
  const response = await apiClient.get(API_ENDPOINTS.contractors.list, {
    params: { pageNumber, pageSize, keyword },
  });
  return response.data;
}

export async function getContractorById(id: string | number) {
  const response = await apiClient.get(API_ENDPOINTS.contractors.contractorDetail(String(id)));
  return response.data;
}

export async function createContractor(data: Contractor) {
  const response = await apiClient.post(API_ENDPOINTS.contractors.addContractor, data);
  return response.data;
}

export async function updateContractor(data: Contractor) {
  const response = await apiClient.put(API_ENDPOINTS.contractors.updateContractor, data);
  return response.data;
}

export async function deleteContractor(id: string | number) {
  const response = await apiClient.delete(API_ENDPOINTS.contractors.deleteContractor(String(id)));
  return response.data;
}
