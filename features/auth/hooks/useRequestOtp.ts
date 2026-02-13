import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
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
      if (!/^[6-9]\d{9}$/.test(phone)) {
        throw new Error('Invalid mobile number');
      }
      return authService.requestOtp({ phone });
    },
  });
}
