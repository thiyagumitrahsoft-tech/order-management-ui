import axios from 'axios'
import { toast } from 'react-toastify'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Response interceptor for error handling
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An error occurred'

    if (error.response?.status === 404) {
      toast.error('Resource not found')
    } else if (error.response?.status === 400) {
      toast.error(message || 'Invalid request')
    } else if (error.response?.status === 500) {
      toast.error('Server error. Please try again later.')
    } else if (error.code === 'ECONNABORTED' || !error.response) {
      toast.error('API Gateway unavailable. Check your connection.')
    }

    return Promise.reject(error)
  }
)

export default axiosClient
