import { useRequestOtp } from '@/features/auth/hooks/useRequestOtp';
import { isValidPhone } from '@/shared/utils/phoneValidator';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Animated, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

/**
 * LoginScreen component for user authentication via phone number.
 * Allows users to enter their phone number and request an OTP.
 */
export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [scaleAnim] = useState(new Animated.Value(1));
  const { mutate, isPending } = useRequestOtp();

  /**
   * Handles the OTP request by validating and trimming the phone number,
   * then triggering the mutation to send OTP.
   */
  function handleRequestOtp() {
    const trimmedPhone = phone.trim();
    if (!isValidPhone(trimmedPhone)) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number.');
      return;
    }

    mutate(trimmedPhone, {
      onSuccess: () => {
        router.push({
          pathname: '/otp',
          params: { phone: trimmedPhone },
        });
      },
      onError: (error) => {
        // console.log(error)
        Alert.alert('Error', 'Failed to send OTP. Please check your connection and try again.');
      },
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Phone Number</Text>

      <TextInput
        placeholder="+919876543210"
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        autoCapitalize="none"
        autoFocus={true}
        accessibilityLabel="Phone number input field"
        onSubmitEditing={handleRequestOtp}
      />

      <Animated.View style={[styles.buttonContainer, { transform: [{ scale: scaleAnim }] }]}>
        <Pressable
          onPress={handleRequestOtp}
          onPressIn={() => Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start()}
          onPressOut={() => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start()}
          disabled={isPending}
          style={styles.button}
          accessibilityLabel="Send OTP button"
        >
          <Text style={styles.buttonText}>{isPending ? 'Sending OTP...' : 'Send OTP'}</Text>
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
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    padding: 15,
    backgroundColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
})