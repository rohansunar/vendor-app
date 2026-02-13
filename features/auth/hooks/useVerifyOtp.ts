import { useMutation } from '@tanstack/react-query';
import { VerifyOtpPayload } from '../auth.types';
import { authService } from '../services/auth.service';

export function useVerifyOtp() {
  return useMutation({
    mutationFn: ({ phone, code }: VerifyOtpPayload) => {
      if (code.length !== 6) {
        throw new Error('Invalid mobile number');
      }
      return authService.verifyOtp({ phone, code });
    },
  });
}
