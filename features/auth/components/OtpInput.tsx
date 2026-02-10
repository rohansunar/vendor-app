import { useEffect, useRef, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { authStyles } from './auth.styles';

type Props = {
  onComplete: (otp: string) => void;
  hasError?: boolean;
};

export function OtpInput({ onComplete, hasError }: Props) {
  const [otp, setOtp] = useState('');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (otp.length === 6) {
      onComplete(otp);
    }
  }, [otp]);

  return (
    <View>
      <View style={authStyles.otpRow}>
        {Array.from({ length: 6 }).map((_, index) => (
          <View
            key={index}
            style={[
              authStyles.otpBox,
              {
                borderColor: hasError ? '#EF4444' : '#1E40AF',
              },
            ]}
          >
            <Text style={authStyles.otpText}>{otp[index] || ''}</Text>
          </View>
        ))}
      </View>

      <TextInput
        ref={inputRef}
        value={otp}
        style={{ position: 'absolute', opacity: 0 }}
        onChangeText={setOtp}
        keyboardType="number-pad"
        maxLength={6}
        autoFocus
        className="absolute opacity-0"
      />
    </View>
  );
}
