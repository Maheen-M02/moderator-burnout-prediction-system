import axios from 'axios'

// Get API URL from environment variable or use localhost for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export { api, API_URL }
export default api
