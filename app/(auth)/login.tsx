import { router } from 'expo-router';
import { useState } from 'react';

import { PhoneLoginForm } from '@/features/auth/components/PhoneInput';
import { useRequestOtp } from '@/features/auth/hooks/useRequestOtp';

export default function LoginScreen() {
  const { mutateAsync, isPending } = useRequestOtp();
  const [error, setError] = useState<string | undefined>();

  async function handleLogin(phone: string) {
    try {
      setError(undefined);
      await mutateAsync(phone);
      router.push({
        pathname: '/(auth)/otp',
        params: { phone },
      });
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to send OTP. Try again.');
    }
  }

  return (
    <PhoneLoginForm
      onSubmit={handleLogin}
      isPending={isPending}
      serverError={error}
    />
  );
}
