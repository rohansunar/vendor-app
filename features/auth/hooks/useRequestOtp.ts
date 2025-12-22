import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';
/**
 * Requests OTP for a phone number
 * Responsibility:
 * - Call backend
 * - Handle loading / error states
 * - No UI logic here
 */
export function useRequestOtp() {
  return useMutation({
    mutationFn: (phone: string) => {
      // console.log('useRequestOtp mutationFn called with phone:', phone);
      return authService.requestOtp(phone);
    },
  });
}
