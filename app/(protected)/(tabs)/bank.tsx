import { Feather } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { useBankAccounts, useCreateBankAccount } from '@/features/bank';
import { bankStyles } from '@/features/bank/components/bank.styles';
import { BankForm } from '@/features/bank/components/BankForm';
import { InfoRow } from '@/shared/ui/InfoRow';
import { StatusBadge } from '@/shared/ui/StatusBadge';

export default function BankScreen() {
  const navigation = useNavigation();
  const { data, isLoading } = useBankAccounts();
  const createBank = useCreateBankAccount();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => null,
      headerLeft: () => (
        <Feather
          name="arrow-left"
          size={22}
          style={{ marginLeft: 12 }}
          onPress={() => router.back()}
        />
      ),
      headerTitle: 'Bank Details',
    });
  }, []);

  if (isLoading) {
    return null;
  }

  // Proper type narrowing: check for array first, then for VendorBank object
  const isBankData = data && !Array.isArray(data);

  return (
    <ScrollView
      style={bankStyles.container}
      contentContainerStyle={bankStyles.scrollContent}
    >
      {isBankData ? (
        <View style={bankStyles.card}>
          <Text style={bankStyles.sectionTitle}>Bank Information</Text>

          <InfoRow label="Account Holder" value={data.accountHolderName} />
          <InfoRow label="Bank Name" value={data.bankName} />
          <InfoRow
            label="Account Number"
            value={`****${data.accountNumber.slice(-4)}`}
          />
          <InfoRow label="IFSC Code" value={data.ifscCode} />
          <InfoRow label="UPI ID" value={data.upiId || 'Not provided'} />

          <View style={bankStyles.badgeRow}>
            <StatusBadge label="Verified" active={data.isVerified} />
            <StatusBadge label="Default" active={data.isDefault} />
          </View>
        </View>
      ) : (
        <BankForm loading={createBank.isPending} onSubmit={createBank.mutate} />
      )}
    </ScrollView>
  );
}
