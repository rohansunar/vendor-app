import { useEffect, useRef, useState } from 'react';
import { Keyboard, Pressable, Text, TextInput, View } from 'react-native';
import { authStyles } from './auth.styles';

type Props = {
  onComplete: (otp: string) => void;
  hasError?: boolean;
};

export function OtpInput({ onComplete, hasError }: Props) {
  const [otp, setOtp] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (otp.length === 6 && !submitted) {
      Keyboard.dismiss();
      setSubmitted(true);
      onComplete(otp);
    }
  }, [otp, submitted]);

  // 🔁 Reset submission lock when OTP changes
  useEffect(() => {
    if (otp.length < 6) {
      setSubmitted(false);
    }
  }, [otp]);

  function focusInput() {
    inputRef.current?.focus();
  }

  return (
    <Pressable onPress={focusInput}>
      <View>
        <View style={authStyles.otpRow}>
          {Array.from({ length: 6 }).map((_, index) => (
            <View
              key={index}
              style={[
                authStyles.otpBox,
                {
                  borderColor: hasError
                    ? '#DC2626'
                    : otp.length === index
                      ? '#2563EB'
                      : '#CBD5E1',
                },
              ]}
            >
              <Text style={authStyles.otpText}>{otp[index] || ''}</Text>
            </View>
          ))}
        </View>

        {/* Hidden but focusable input */}
        <TextInput
          ref={inputRef}
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          maxLength={6}
          caretHidden
          contextMenuHidden
          style={{
            position: 'absolute',
            height: 48,
            width: '100%',
            opacity: 0,
          }}
        />
      </View>
    </Pressable>
  );
}
