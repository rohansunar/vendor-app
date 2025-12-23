import { useRequestOtp } from '@/features/auth/hooks/useRequestOtp';
import { isValidPhone } from '@/shared/utils/phoneValidator';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

/**
 * LoginScreen component for user authentication via phone number.
 * Allows users to enter their phone number and request an OTP.
 */
export default function LoginScreen() {
  const [digits, setDigits] = useState(Array(10).fill(''));
  const [scaleAnim] = useState(new Animated.Value(1));
  const { mutate, isPending } = useRequestOtp();
  const refs = Array(10)
    .fill(null)
    .map(() => useRef<TextInput>(null));

  /**
   * Handles the OTP request by validating and trimming the phone number,
   * then triggering the mutation to send OTP.
   */
  function handleRequestOtp() {
    const phone = digits.join('');
    if (!isValidPhone(phone)) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number.');
      return;
    }

    mutate(phone, {
      onSuccess: () => {
        router.push({
          pathname: '/otp',
          params: { phone },
        });
      },
      onError: (error) => {
        console.log(error);
        Alert.alert(
          'Error',
          'Failed to send OTP. Please check your connection and try again.',
        );
      },
    });
  }

  function handleDigitChange(index: number, text: string) {
    if (!/^\d$/.test(text) && text !== '') return;
    const newDigits = [...digits];
    newDigits[index] = text;
    setDigits(newDigits);
    if (text && index < 9) {
      refs[index + 1].current?.focus();
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Phone Number</Text>

      <View style={styles.inputContainer}>
        {digits.map((digit, index) => (
          <TextInput
            key={index}
            ref={refs[index]}
            style={styles.digitInput}
            value={digit}
            onChangeText={(text) => handleDigitChange(index, text)}
            keyboardType="numeric"
            maxLength={1}
            autoFocus={index === 0}
            accessibilityLabel={`Digit ${index + 1} input field`}
          />
        ))}
      </View>

      <Animated.View
        style={[styles.buttonContainer, { transform: [{ scale: scaleAnim }] }]}
      >
        <Pressable
          onPress={handleRequestOtp}
          onPressIn={() =>
            Animated.spring(scaleAnim, {
              toValue: 0.95,
              useNativeDriver: true,
            }).start()
          }
          onPressOut={() =>
            Animated.spring(scaleAnim, {
              toValue: 1,
              useNativeDriver: true,
            }).start()
          }
          disabled={isPending}
          style={styles.button}
          accessibilityLabel="Send OTP button"
        >
          <Text style={styles.buttonText}>
            {isPending ? 'Sending OTP...' : 'Send OTP'}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 30,
  },
  digitInput: {
    width: 35,
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    textAlign: 'center',
    fontSize: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonContainer: {
    width: '80%',
  },
  button: {
    padding: 15,
    backgroundColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
