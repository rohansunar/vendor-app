import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Text, TextInput, View } from 'react-native';

import { GradientButton } from '@/shared/ui/GradientButton';
import { Keyboard } from 'react-native';
import { PhoneLoginFormValues, phoneSchema } from '../auth.schema';
import { authStyles } from './auth.styles';

type Props = {
  onSubmit: (phone: string) => Promise<void>;
  isPending: boolean;
  serverError?: string;
};

export function PhoneLoginForm({ onSubmit, isPending, serverError }: Props) {
  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<PhoneLoginFormValues>({
    resolver: zodResolver(phoneSchema),
  });

  return (
    <View style={authStyles.container}>
      {/* Logo */}
      <View style={authStyles.logoContainer}>
        <Text style={authStyles.logoText}>Quick Serve</Text>
      </View>

      {/* Card */}
      <View style={authStyles.card}>
        <Text style={authStyles.title}>Login with mobile</Text>

        <Text style={authStyles.subtitle}>
          We’ll send you a verification code
        </Text>

        <TextInput
          keyboardType="number-pad"
          maxLength={10}
          placeholder="Enter mobile number"
          placeholderTextColor="#94A3B8"
          style={[
            authStyles.input,
            {
              borderColor: errors.phone ? '#DC2626' : '#CBD5E1',
            },
          ]}
          onChangeText={(text) =>
            setValue('phone', text, {
              shouldValidate: true,
            })
          }
        />

        {errors.phone && (
          <Text style={authStyles.errorText}>{errors.phone.message}</Text>
        )}

        {serverError && <Text style={authStyles.errorText}>{serverError}</Text>}

        <GradientButton
          title="Request OTP"
          loading={isPending}
          disabled={isPending}
          onPress={handleSubmit((data) => {
            Keyboard.dismiss(); // 👈 hides keyboard
            onSubmit(data.phone);
          })}
        />
      </View>
    </View>
  );
}
