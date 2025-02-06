import axios from 'axios';

export const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Required for sending/receiving cookies
  headers: {
    'Content-Type': 'application/json',
  },
});
