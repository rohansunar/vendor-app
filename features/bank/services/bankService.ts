import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import { BankAccount } from '../types';

export const bankService = {
  /**
   * Get user's bank account
   */
  async getBankAccount(): Promise<BankAccount> {
     const response = await apiClient.get(API_ENDPOINTS.BANK);
     return response.data;
  },

  /**
   * Update bank account details
   */
  updateBankAccount(data: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  }) {
    return apiClient.post(API_ENDPOINTS.BANK, data);
  },
};
