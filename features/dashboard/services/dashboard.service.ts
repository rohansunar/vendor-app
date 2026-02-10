import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import axios from 'axios';
import { DashboardResponse } from '../dashboard.types';

export async function fetchDashboard(): Promise<DashboardResponse> {
  try {
    const res = await apiClient.get(API_ENDPOINTS.DASHBOARD);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Backend responded but with error
      const message =
        error.response?.data?.message || 'Failed to fetch dashboard data';

      throw new Error(message);
    }

    // Unknown error
    throw new Error('Something went wrong');
  }
}
