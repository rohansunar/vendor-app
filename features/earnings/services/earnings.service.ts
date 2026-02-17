
import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import axios from 'axios';
import { EarningsResponse } from '../types';

export type EarningsDateRange = 'weekly' | 'monthly' | 'custom';

export interface EarningsFilterParams {
    startDate?: string;
    endDate?: string;
}

export const fetchEarningsData = async (
    params?: EarningsFilterParams
): Promise<EarningsResponse> => {
    try {
        const queryParams: Record<string, string> = {};

        if (params) {
            if (params.startDate && params.endDate) {
                queryParams.startDate = params.startDate;
                queryParams.endDate = params.endDate;
            }
        }

        // Convert queryParams to query string
        const queryString = new URLSearchParams(queryParams).toString();
        const url = `${API_ENDPOINTS.EARNINGS}${queryString ? `?${queryString}` : ''}`;

        const response = await apiClient.get(url);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message =
                error.response?.data?.message || 'Failed to fetch earnings data';
            throw new Error(message);
        }
        throw new Error('An unexpected error occurred while fetching earnings data');
    }
};
