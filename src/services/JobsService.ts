import apiClient from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/config/config";

export type JobPriority = "High" | "Normal" | "Low" | string;

export interface Job {
  id: number;
  companyId: number;
  projectId: number;
  clientId: number;
  title: string;
  description: string;
  status: string;
  priority: JobPriority;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  startTime: string; // 24h string
  finishTime: string; // 24h string
  locationName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  createdBy: number;
  createdOnUtc: string;
  lastUpdatedUtc: string;

  // optional extra fields the API might return
  [key: string]: unknown;
}

export interface GetJobsOptions {
  pageNumber?: number;
  pageSize?: number;
  keyword?: string;
}

export async function getJobs(options: GetJobsOptions = {}) {
  const { pageNumber = 1, pageSize = 20, keyword = "" } = options;
  const response = await apiClient.get(API_ENDPOINTS.jobs.list, {
    params: { pageNumber, pageSize, keyword },
  });
  return response.data;
}

export async function getJobById(id: string | number) {
  const response = await apiClient.get(API_ENDPOINTS.jobs.jobDetail(String(id)));
  return response.data;
}

export async function createJob(data: Job) {
  const response = await apiClient.post(API_ENDPOINTS.jobs.addJob, data);
  return response.data;
}

export async function updateJob(data: Job) {
  const response = await apiClient.put(API_ENDPOINTS.jobs.updateJob, data);
  return response.data;
}

export async function deleteJob(id: string | number) {
  const response = await apiClient.delete(API_ENDPOINTS.jobs.deleteJob(String(id)));
  return response.data;
}
