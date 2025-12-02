import apiClient from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/config/config';

export interface Project {
  id?: string | number;
  name: string;
  clientId?: string | number;
  client?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  teamSize?: number;
  jobsCount?: number;
  // optional flexible fields
  budget?: number;
  revenue?: number;
}

export interface GetProjectsOptions {
  pageNumber?: number;
  pageSize?: number;
  keyword?: string;
}

export async function getProjects(options: GetProjectsOptions = {}) {
  const { pageNumber = 1, pageSize = 20, keyword = '' } = options;
  const response = await apiClient.get(API_ENDPOINTS.projects.list, {
    params: {
      pageNumber,
      pageSize,
      keyword,
    },
  });
  return response.data;
}

export async function getProjectById(id: string | number) {
  const response = await apiClient.get(API_ENDPOINTS.projects.projectDetail(String(id)));
  return response.data;
}

export async function createProject(data: Project) {
  const response = await apiClient.post(API_ENDPOINTS.projects.addProject, data);
  return response.data;
}

export async function updateProject(id: string | number, data: Partial<Project>) {
  const response = await apiClient.put(API_ENDPOINTS.projects.updateProject(String(id)), data);
  return response.data;
}

export async function deleteProject(id: string | number) {
  const response = await apiClient.delete(API_ENDPOINTS.projects.deleteProject(String(id)));
  return response.data;
}
