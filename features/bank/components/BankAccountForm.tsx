import { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { BankAccount } from '../types';

interface BankAccountFormProps {
  account?: BankAccount;
  onSave: (data: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  }) => void;
  onDelete?: () => void;
  onCancel: () => void;
  isPending: boolean;
}

export function BankAccountForm({
  account,
  onSave,
  onDelete,
  onCancel,
  isPending,
}: BankAccountFormProps) {
  const [accountHolderName, setAccountHolderName] = useState(
    account?.accountHolderName || '',
  );
  const [accountNumber, setAccountNumber] = useState(
    account?.accountNumber || '',
  );
  const [ifscCode, setIfscCode] = useState(account?.ifscCode || '');
  const [bankName, setBankName] = useState(account?.bankName || '');

  useEffect(() => {
    if (account) {
      setAccountHolderName(account.accountHolderName);
      setAccountNumber(account.accountNumber);
      setIfscCode(account.ifscCode);
      setBankName(account.bankName);
    }
  }, [account]);

  const handleSave = () => {
    if (!accountHolderName || !accountNumber || !ifscCode || !bankName) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    onSave({ accountHolderName, accountNumber, ifscCode, bankName });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete this bank account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ],
    );
  };

  const isEdit = !!account;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isEdit ? 'Edit Bank Account' : 'Add Bank Account'}
      </Text>

      <TextInput
        placeholder="Account Holder Name"
        value={accountHolderName}
        onChangeText={setAccountHolderName}
        style={styles.input}
      />

      <TextInput
        placeholder="Account Number"
        value={accountNumber}
        onChangeText={setAccountNumber}
        keyboardType="number-pad"
        style={styles.input}
        editable={!account?.is_verified}
      />

      <TextInput
        placeholder="IFSC Code"
        value={ifscCode}
        onChangeText={setIfscCode}
        autoCapitalize="characters"
        style={styles.input}
        editable={!account?.is_verified}
      />

      <TextInput
        placeholder="Bank Name"
        value={bankName}
        onChangeText={setBankName}
        style={styles.input}
        editable={!account?.is_verified}
      />

      {account?.is_verified && (
        <Text style={styles.note}>
          Bank details are verified and cannot be edited.
        </Text>
      )}

      <View style={styles.buttonContainer}>
        <Button title="Cancel" onPress={onCancel} />
        <Button
          title={isPending ? 'Saving...' : 'Save'}
          onPress={handleSave}
          disabled={isPending}
        />
      </View>

      {isEdit && onDelete && (
        <Button title="Delete" onPress={handleDelete} color="red" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
    borderRadius: 4,
  },
  note: {
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
});
