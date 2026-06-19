import axios from 'axios'
import { useAuthStore } from '@/store/auth.store'

function makeClient(baseURL: string) {
  const client = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
  })

  client.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        useAuthStore.getState().clearAuth()
        window.location.href = '/login'
      }
      return Promise.reject(error)
    },
  )

  return client
}

export const api = makeClient(
  import.meta.env.VITE_API_BASE_URL ?? 'https://authgen.azurewebsites.net',
)
export const tdoApi = makeClient(
  import.meta.env.VITE_TDO_API_BASE_URL ?? 'https://tdoserver.azurewebsites.net',
)
