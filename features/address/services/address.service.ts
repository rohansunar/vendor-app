import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import { Address, AddressFormData } from '../address.types';

export const addressService = {
  /**
   * Get user's addresses
   * Returns a single address or null as per single-address requirement
   */
  async getAddresses(): Promise<Address | null> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ADDRESS);
      // The requirement says single address. If it's an array, we take first. 
      // If it's an object, we return it.
      if (Array.isArray(response.data)) {
        return response.data.length > 0 ? response.data[0] : null;
      }
      return response.data || null;
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
      throw error;
    }
  },

  /**
   * Create a new address
   */
  async createAddress(data: AddressFormData) {
    try {
      return await apiClient.post(API_ENDPOINTS.ADDRESS, data);
    } catch (error) {
      console.error('Failed to create address:', error);
      throw error;
    }
  },

  /**
   * Update address details by ID
   */
  async updateAddress(
    id: string,
    data: AddressFormData,
  ) {
    try {
      return await apiClient.put(`${API_ENDPOINTS.ADDRESS}/${id}`, data);
    } catch (error) {
      console.error('Failed to update address:', error);
      throw error;
    }
  }
};
