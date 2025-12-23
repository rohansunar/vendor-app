import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';

export const profileService = {
  getProfile() {
    return apiClient.get(API_ENDPOINTS.VENDOR_PROFILE);
  },

  updateProfile(data: { name: string; email: string }) {
    return apiClient.put(API_ENDPOINTS.VENDOR_PROFILE, data);
  },
};
