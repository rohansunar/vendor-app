import { Feather } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { useBankAccounts, useCreateBankAccount } from '@/features/bank';
import { bankStyles } from '@/features/bank/components/bank.styles';
import { BankForm } from '@/features/bank/components/BankForm';

function InfoRow({ label, value }: any) {
  return (
    <View style={bankStyles.infoRow}>
      <Text style={bankStyles.infoLabel}>{label}</Text>
      <Text style={bankStyles.infoValue}>{value}</Text>
    </View>
  );
}

function StatusBadge({ label, active }: any) {
  return (
    <View
      style={[
        bankStyles.badge,
        {
          backgroundColor: active
            ? '#DCFCE7'
            : '#FEE2E2',
        },
      ]}
    >
      <Text
        style={{
          color: active ? '#16A34A' : '#DC2626',
          fontWeight: '600',
        }}
      >
        {label}: {active ? 'Yes' : 'No'}
      </Text>
    </View>
  );
}

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
          <Text style={bankStyles.sectionTitle}>
            Bank Information
          </Text>
  
          <InfoRow
            label="Account Holder"
            value={data.accountHolderName}
          />
          <InfoRow
            label="Bank Name"
            value={data.bankName}
          />
          <InfoRow
            label="Account Number"
            value={`****${data.accountNumber.slice(-4)}`}
          />
          <InfoRow
            label="IFSC Code"
            value={data.ifscCode}
          />
          <InfoRow
            label="UPI ID"
            value={data.upiId || 'Not provided'}
          />
  
          <View style={bankStyles.badgeRow}>
            <StatusBadge
              label="Verified"
              active={data.isVerified}
            />
            <StatusBadge
              label="Default"
              active={data.isDefault}
            />
          </View>
         </View>
        ) : (
          <BankForm loading={createBank.isPending} onSubmit={createBank.mutate} />
        )}
      </ScrollView>
    );
  }
