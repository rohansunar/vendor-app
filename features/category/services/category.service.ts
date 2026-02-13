import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import { Category } from '../types';

export const categoryService = {
  getCategories(): Promise<Category[]> {
    return apiClient.get(API_ENDPOINTS.CATEGORIES).then((res) => res.data);
  },
};
