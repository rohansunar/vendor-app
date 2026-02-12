import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import { Order, OrdersResponse } from '../orders.types';

export const orderService = {
  async getOrders(): Promise<OrdersResponse> {
    const response = await apiClient.get(`${API_ENDPOINTS.VENDOR_ORDER}`);
    return response.data;
  },

  getOrderById(id: string): Promise<Order> {
    return apiClient
      .get(`${API_ENDPOINTS.VENDOR_ORDER}/${id}`)
      .then((res) => res.data);
  },

  async rejectOrder(id: string, cancelReason: string): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.VENDOR_ORDER}/${id}/cancel`, {
      cancelReason,
    });
  },

  async getRiders(): Promise<any[]> {
    const response = await apiClient.get(API_ENDPOINTS.RIDERS);
    return response.data;
  },

  async assignRiders(orderIds: string[], riderId: string): Promise<void> {
    if (!orderIds?.length || !riderId) {
      throw new Error('Order IDs and Rider ID are required');
    }
    try {
      await apiClient.post(`${API_ENDPOINTS.VENDOR_ORDER}/assign`, {
        orderIds,
        riderId,
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to assign rider(s)');
    }
  },

  async markOutForDelivery(id: string): Promise<void> {
    await apiClient.post(
      `${API_ENDPOINTS.VENDOR_ORDER}/${id}/out-for-delivery`,
    );
  },

  async confirmDelivery(
    id: string,
    data: { otp?: string; image?: string },
  ): Promise<void> {
    await apiClient.post(
      `${API_ENDPOINTS.VENDOR_ORDER}/${id}/verify-delivery-otp`,
      data,
    );
  },
};
