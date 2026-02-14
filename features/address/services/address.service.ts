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
      return response.data || null;
    } catch (error) {
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
      throw error;
    }
  },

  /**
   * Update address details by ID
   */
  async updateAddress(data: AddressFormData) {
    try {
      console.log("UpdateData", data)
      return await apiClient.put(API_ENDPOINTS.ADDRESS, data);
    } catch (error) {
      throw error;
    }
  },
};
