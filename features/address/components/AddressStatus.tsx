import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Address } from '../address.types';

/**
 * Props for the AddressStatus component.
 */
export interface AddressStatusProps {
  address?: Address;
}

/**
 * AddressStatus component displays read-only system identifiers and status information.
 * Shows address active status and serviceability information.
 */
export function AddressStatus({ address }: AddressStatusProps) {
  if (!address) {
    return null;
  }

  return (
    <View style={styles.statusRow}>
      <View
        style={[
          styles.statusBadge,
          { backgroundColor: address.is_active ? '#DEF7EC' : '#FDE8E8' },
        ]}
      >
        <Ionicons
          name={address.is_active ? 'checkmark-circle' : 'close-circle'}
          size={14}
          color={address.is_active ? '#03543F' : '#9B1C1C'}
        />
        <Text
          style={[
            styles.statusText,
            { color: address.is_active ? '#03543F' : '#9B1C1C' },
          ]}
        >
          Address Status: {address.is_active ? 'Active' : 'Inactive'}
        </Text>
      </View>
      <View
        style={[
          styles.statusBadge,
          {
            backgroundColor: address.isServiceable ? '#E1EFFE' : '#FEF3C7',
          },
        ]}
      >
        <Ionicons
          name="location"
          size={14}
          color={address.isServiceable ? '#1E429F' : '#92400E'}
        />
        <Text
          style={[
            styles.statusText,
            { color: address.isServiceable ? '#1E429F' : '#92400E' },
          ]}
        >
          Address Serviceability:{' '}
          {address.isServiceable ? 'Serviceable' : 'No Service'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },
});
