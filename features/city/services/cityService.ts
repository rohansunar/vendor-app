import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';

export type City = {
  id: string;
  name: string;
};

export const cityService = {
  getCities() {
    return apiClient.get(API_ENDPOINTS.CITIES).then(res => res.data);
  },
};
