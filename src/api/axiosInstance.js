import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://dummyjson.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// TODO (Phase 2): Add request interceptor to attach Bearer token
// axiosInstance.interceptors.request.use((config) => {
//   const token = /* get token from auth store/context */
//   if (token) config.headers.Authorization = `Bearer ${token}`
//   return config
// })

// TODO (Phase 2): Add response interceptor to handle 401 Unauthorized
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // redirect to /login and clear auth state
//     }
//     return Promise.reject(error)
//   }
// )

export default axiosInstance
