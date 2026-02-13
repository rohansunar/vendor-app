import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import { RequestOtpPayload, VerifyOtpPayload } from '../auth.types';

export const authService = {
  requestOtp(payload: RequestOtpPayload) {
    return apiClient.post(API_ENDPOINTS.REQUEST_OTP, payload);
  },

  async verifyOtp(payload: VerifyOtpPayload) {
    return apiClient.post(API_ENDPOINTS.VERIFY_OTP, payload);
  },
};
