import apiClient from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/config/config";

export interface Employee {
  id?: string | number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role?: string;
  status?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postcode?: string;
}

export interface GetEmployeesOptions {
  pageNumber?: number;
  pageSize?: number;
  keyword?: string;
}

export async function getEmployees(options: GetEmployeesOptions = {}) {
  const { pageNumber = 1, pageSize = 20, keyword = "" } = options;
  const response = await apiClient.get(API_ENDPOINTS.employees.list, {
    params: { pageNumber, pageSize, keyword },
  });
  return response.data;
}

export async function getEmployeeById(id: string | number) {
  const response = await apiClient.get(API_ENDPOINTS.employees.employeeDetail(String(id)));
  return response.data;
}

export async function createEmployee(data: Employee) {
  const response = await apiClient.post(API_ENDPOINTS.employees.addEmployee, data);
  return response.data;
}

export async function updateEmployee(data: Employee) {
  const response = await apiClient.put(API_ENDPOINTS.employees.updateEmployee, data);
  return response.data;
}

export async function deleteEmployee(id: string | number) {
  const response = await apiClient.delete(API_ENDPOINTS.employees.deleteEmployee(String(id)));
  return response.data;
}
