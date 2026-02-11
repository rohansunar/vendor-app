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
};
