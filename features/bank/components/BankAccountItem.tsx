import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BankAccount } from '../types';

interface BankAccountItemProps {
  account: BankAccount;
  onPress: () => void;
}

export function BankAccountItem({ account, onPress }: BankAccountItemProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
    >
      <View style={styles.content}>
        <Text style={styles.title}>
          {account.accountHolderName} - {account.accountNumber} - {account.bankName}
        </Text>
        <Ionicons
          name={account.is_verified ? 'checkmark-circle' : 'time-outline'}
          size={20}
          color={account.is_verified ? 'green' : 'orange'}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
});
