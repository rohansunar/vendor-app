import { getToken, removeToken } from '@/core/storage/secureStorage';
import axios from 'axios';
import { router } from 'expo-router';
import { ENV } from '../config/env';

// Create axios instance
export const apiClient = axios.create({
  baseURL: ENV.API_URL,
  timeout: 10000,
});

// Set up interceptors
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      removeToken();
      router.replace('/(auth)/login');
    }
    return Promise.reject(error);
  },
);
