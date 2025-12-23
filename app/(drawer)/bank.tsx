import { useBankAccount } from '@/features/bank/hooks/useBankAccount';
import { useUpdateBankAccount } from '@/features/bank/hooks/useUpdateBankAccount';
import { useEffect, useState } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function BankScreen() {
  const { data, isLoading, error } = useBankAccount();
  const { mutate, isPending } = useUpdateBankAccount();

  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [bankName, setBankName] = useState('');

  useEffect(() => {
    if (data) {
      setAccountHolderName(data.accountHolderName);
      setAccountNumber(data.accountNumber);
      setIfscCode(data.ifscCode);
      setBankName(data.bankName);
    }
  }, [data]);

  if (isLoading) {
    return <Text>Loading bank details...</Text>;
  }

  if (error) {
    return <Text>Error loading Bank Details: {error.message}</Text>;
  }
  function handleSave() {
    mutate({
      accountHolderName: accountHolderName,
      accountNumber: accountNumber,
      ifscCode: ifscCode,
      bankName: bankName,
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bank Account</Text>

      {/* Verification status */}
      <Text style={styles.status}>
        Status: {data?.is_verified ? 'Verified' : 'Not Verified'}
      </Text>

      <Text>Account Holder Name</Text>
      <TextInput
        value={accountHolderName}
        onChangeText={setAccountHolderName}
        style={styles.input}
      />

      <Text>Account Number</Text>
      <TextInput
        value={accountNumber}
        onChangeText={setAccountNumber}
        keyboardType="number-pad"
        style={styles.input}
        editable={!data?.is_verified}
      />

      <Text>IFSC Code</Text>
      <TextInput
        value={ifscCode}
        onChangeText={setIfscCode}
        autoCapitalize="characters"
        style={styles.input}
        placeholder='SBIN0001234'
        editable={!data?.is_verified}
      />

      <Text>Bank Name</Text>
      <TextInput
        value={bankName}
        onChangeText={setBankName}
        style={styles.input}
        editable={!data?.is_verified}
      />

      {data?.is_verified && (
        <Text style={styles.note}>
          Bank details are verified and cannot be edited.
        </Text>
      )}

      {!data?.is_verified && (
        <Button
          title={isPending ? 'Saving...' : 'Save Bank Details'}
          onPress={handleSave}
          disabled={isPending}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    marginBottom: 12,
  },
  status: {
    marginBottom: 12,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 12,
  },
  note: {
    color: '#666',
    marginTop: 12,
  },
});
