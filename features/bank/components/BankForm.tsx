import { GradientButton } from '@/shared/ui/GradientButton';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text, TextInput, View } from 'react-native';
import { BankFormValues, bankSchema } from '../bank.schema';
import { bankStyles } from './bank.styles';

type Props = {
  onSubmit: (payload: any) => void;
  loading: boolean;
};

/* ---------- Reusable Field Component ---------- */
function FormField({
  control,
  name,
  placeholder,
  error,
  keyboardType,
  autoCapitalize,
}: any) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder={placeholder}
            value={value}
            onChangeText={onChange}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            style={[
              bankStyles.input,
              error && { borderColor: '#DC2626' },
            ]}
          />
        )}
      />

      {error && (
        <Text style={bankStyles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
}

export function BankForm({ onSubmit, loading }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BankFormValues>({
    resolver: zodResolver(bankSchema),
    defaultValues: {
      accountHolderName: '',
      accountNumber: '',
      ifscCode: '',
      bankName: '',
      upiId: '',
    },
  });

  return (
    <View style={bankStyles.card}>
      <Text style={bankStyles.sectionTitle}>Add Bank Details</Text>

       {/* Account Holder */}
      <FormField
        control={control}
        name="accountHolderName"
        placeholder="Account Holder Name"
        error={errors.accountHolderName?.message}
      />
      
      {/* Account Number */}
      <FormField
        control={control}
        name="accountNumber"
        placeholder="Account Number"
        keyboardType="number-pad"
        error={errors.accountNumber?.message}
      />

      {/* IFSC */}
      <FormField
        control={control}
        name="ifscCode"
        placeholder="IFSC Code"
        autoCapitalize="characters"
        error={errors.ifscCode?.message}
      />

      {/* Bank Name */}
      <FormField
        control={control}
        name="bankName"
        placeholder="Bank Name"
        error={errors.bankName?.message}
      />

      {/* UPI */}
      <FormField
        control={control}
        name="upiId"
        placeholder="UPI ID (optional)"
        error={errors.upiId?.message}
      />

      <GradientButton
        title="Save Bank Details"
        loading={loading}
        onPress={handleSubmit(onSubmit)}
      />
    </View>
  );
}
