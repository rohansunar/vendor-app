import { showError, showSuccess } from '@/core/ui/toast';
import { getErrorMessage } from '@/core/utils/getErrorMessage';
import {
  useAddresses,
  useCreateAddress,
  useLocationLogic,
  useUpdateAddress,
} from '@/features/address';
import { AddressFormData } from '@/features/address/address.types';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AddressForm } from './AddressForm';

export function AddressHeader() {
  const { data: address, isLoading, isError } = useAddresses();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { requestPermissionAndGetCurrentLocation } = useLocationLogic();

  // Automatically ask for location if address fails or is empty
  useEffect(() => {
    let mounted = true;
    if (!isLoading && (isError || !address)) {
      requestPermissionAndGetCurrentLocation().then(
        (location: { latitude: number; longitude: number } | null) => {
          if (mounted && location) {
            setIsModalVisible(true);
          }
        },
      );
    }
    return () => {
      mounted = false;
    };
  }, [isLoading, isError, address, requestPermissionAndGetCurrentLocation]);

  const createMutation = useCreateAddress();
  const updateMutation = useUpdateAddress();

  const handleSave = (formData: AddressFormData) => {
    if (address?.id) {
      updateMutation.mutate(formData, {
        onSuccess: (res) => {
          showSuccess(res?.data?.message || 'Address updated successfully');
          setIsModalVisible(false);
        },
        onError: (error) => {
          showError(getErrorMessage(error));
        },
      });
    } else {
      createMutation.mutate(formData, {
        onSuccess: (res) => {
          showSuccess(res?.data?.message || 'Address saved successfully');
          setIsModalVisible(false);
        },
        onError: (error) => {
          showError(getErrorMessage(error));
        },
      });
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={() => setIsModalVisible(true)}
        activeOpacity={0.7}
      >
        <Ionicons name="location" size={18} color="#FFFFFF" />
        <View style={styles.textContainer}>
          <Text style={styles.label} numberOfLines={1}>
            {address ? address.address : 'Add Delivery Address'}
          </Text>
          <Text style={styles.subLabel} numberOfLines={1}>
            {address
              ? `${address.location.state}, ${address.pincode}`
              : 'Set your location'}
          </Text>
        </View>
        <Ionicons
          name="chevron-down"
          size={16}
          color="#FFFFFF"
          style={styles.chevron}
        />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <AddressForm
              address={address || undefined}
              onSave={handleSave}
              onCancel={() => setIsModalVisible(false)}
              isPending={createMutation.isPending || updateMutation.isPending}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    maxWidth: '100%',
  },
  textContainer: {
    marginLeft: 8,
    flexShrink: 1,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  subLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
    marginTop: -2,
  },
  chevron: {
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
  },
});
