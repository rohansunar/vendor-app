import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { saveToken } from '@/core/storage/secureStorage';
import { OtpInput } from '@/features/auth/components/OtpInput';
import { authStyles } from '@/features/auth/components/auth.styles';
import { useVerifyOtp } from '@/features/auth/hooks/useVerifyOtp';
import { hapticError, hapticSuccess } from '@/shared/utils/haptics';

const RESEND_INTERVAL = 180; // 3 minutes
export default function OtpScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const { mutateAsync } = useVerifyOtp();

  const [error, setError] = useState(false);
  const [timer, setTimer] = useState(RESEND_INTERVAL);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  async function handleOtpComplete(code: string) {
    try {
      setError(false);
      const result = await mutateAsync({ phone: phone!, code });
      hapticSuccess();
      // store token (next section)
      await saveToken(result.data.token);
      router.replace('/(protected)/(tabs)/dashboard');
    } catch (error) {
      setError(true);
      hapticError();
    }
  }

  return (
    <View style={authStyles.container}>
      <View style={authStyles.card}>
        <Text style={authStyles.title}>Verify OTP</Text>

        <Text style={authStyles.subtitle}>Code sent to {phone}</Text>

        <OtpInput onComplete={handleOtpComplete} hasError={error} />

        {error && (
          <Text style={authStyles.errorText}>
            Invalid OTP. Please try again.
          </Text>
        )}

        <Text style={authStyles.timerText}>
          {timer > 0
            ? `Time remaining: ${Math.floor(
                timer / 60,
              )}:${String(timer % 60).padStart(2, '0')}`
            : 'OTP expired. Request a new one.'}
        </Text>
      </View>
    </View>
  );
}
