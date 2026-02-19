import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import { RiderFormValues } from './rider.schema';
import { Rider } from './rider.types';

export const riderService = {
    async getRiders(): Promise<Rider[]> {
        const response = await apiClient.get(API_ENDPOINTS.RIDERS);
        return response.data;
    },

    async addRider(data: RiderFormValues): Promise<Rider> {
        return await apiClient.post(API_ENDPOINTS.RIDERS, data);
    },
};
