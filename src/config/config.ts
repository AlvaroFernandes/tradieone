/**
 * Central configuration file for API endpoints and application settings
 */


// Base API URL for non-auth backend (tdo server)
export const API_BASE_URL = 'https://tdoserver.azurewebsites.net';

// API Endpoints
export const API_ENDPOINTS = {
  users: {
    profile: `${API_BASE_URL}/api/UserProfile`,
    addUserInfo: `${API_BASE_URL}/api/UserProfile`,
    updateProfile: `${API_BASE_URL}/api/UserProfile`,
  },
  clients: {
    // List endpoint expects query params: pageNumber, pageSize, keyword
    list: `${API_BASE_URL}/api/Clients/GetList`,
    clientDetail: (id: string) => `${API_BASE_URL}/api/Clients/${id}`,
    addClient: `${API_BASE_URL}/api/Clients`,
    updateClient: `${API_BASE_URL}/api/Clients/`,
    deleteClient: (id: string) => `${API_BASE_URL}/api/Clients/id=${id}`,
  },
  projects: {
    // REST endpoints for Project resource (list via GET, create POST, update PUT, delete DELETE)
    list: `${API_BASE_URL}/api/project`,
    projectDetail: (id: string) => `${API_BASE_URL}/api/project/${id}`,
    addProject: `${API_BASE_URL}/api/project`,
    updateProject: (id: string) => `${API_BASE_URL}/api/project/${id}`,
    deleteProject: (id: string) => `${API_BASE_URL}/api/project/${id}`,
  },
  // Add more endpoint groups as needed
  // projects: {
  //   list: `${API_BASE_URL}/projects`,
  //   detail: (id: string) => `${API_BASE_URL}/projects/${id}`,
  // },
  // jobs: {
  //   list: `${API_BASE_URL}/jobs`,
  // },
  // clients: {
  //   list: `${API_BASE_URL}/clients`,
  // },
} as const;

// Application settings
export const APP_CONFIG = {
  appName: 'TradieOne',
  version: '1.0.0',
} as const;
