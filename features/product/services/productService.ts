import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import { Product } from '../types';

export const productService = {
  getProducts(): Promise<Product[]> {
    return apiClient.get(API_ENDPOINTS.PRODUCT).then((res) => res.data);
  },

  getProduct(id: string): Promise<Product> {
    return apiClient
      .get(`${API_ENDPOINTS.PRODUCT}/${id}`)
      .then((res) => res.data);
  },

  createProduct(data: { name: string; description?: string; price: number }) {
    return apiClient.post(API_ENDPOINTS.PRODUCT, data);
  },

  updateProduct(
    id: string,
    data: {
      name: string;
      description?: string;
      price: number;
      is_active: boolean;
    },
  ) {
    return apiClient.put(`${API_ENDPOINTS.PRODUCT}/${id}`, data);
  },

  /**
   * Delete product by ID
   */
  deleteProduct(id: string) {
    return apiClient.delete(`/products/${id}`);
  },
};
