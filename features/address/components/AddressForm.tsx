import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AddressFormData, AddressFormProps } from '../address.types';
import { useLocationLogic } from '../hooks/useLocationLogic';
import { MapComponent } from './MapComponent';

/**
 * AddressForm component for updating delivery address.
 * Adheres to requirements: restricted editing (only address and pincode),
 * read-only system fields, and mocked geolocation.
 */
export function AddressForm({
  address,
  onSave,
  onCancel,
  isPending,
}: AddressFormProps) {
  const {
    location,
    addressDetails,
    loading: locationLoading,
    requestPermissionAndGetCurrentLocation,
    reverseGeocode,
    setLocation,
  } = useLocationLogic();

  const [formData, setFormData] = useState<AddressFormData>({
    pincode: address?.pincode || '',
    address: address?.address || '',
    city: address?.location?.name || '',
    state: address?.location?.state || '',
    lat: '',
    lng: '',
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof AddressFormData, string>>
  >({});

  // Initialize form with address data if available
  useEffect(() => {
    if (address) {
      setFormData((prev) => ({
        ...prev,
        pincode: address.pincode,
        address: address.address,
        city: address.location?.name || '',
        state: address.location?.state || '',
        // Keep existing lat/lng or default to empty if not present (since backend doesn't support it yet)
        lat: prev.lat || '',
        lng: prev.lng || '',
      }));

      // If we don't have coordinates, we could try to geocode the address or just get current location
      // For now, let's try to get current location if lat/lng are empty to give a better UX
      if (!formData.lat || !formData.lng) {
        requestPermissionAndGetCurrentLocation().then((loc) => {
          if (loc) {
            setFormData((prev) => ({
              ...prev,
              lat: loc.latitude.toString(),
              lng: loc.longitude.toString(),
            }));
          }
        });
      }
    } else {
      // If no address provided (new/empty), try to get current location
      requestPermissionAndGetCurrentLocation().then((loc) => {
        if (loc) {
          setFormData((prev) => ({
            ...prev,
            lat: loc.latitude.toString(),
            lng: loc.longitude.toString(),
          }));
        }
      });
    }
  }, [address]);

  // Update form when address details from geocoding change
  useEffect(() => {
    if (addressDetails.city || addressDetails.state || addressDetails.pincode) {
      setFormData((prev) => ({
        ...prev,
        city: addressDetails.city || prev.city,
        state: addressDetails.state || prev.state,
        pincode: addressDetails.pincode || prev.pincode,
      }));
    }
  }, [addressDetails]);

  const handleLocationSelect = async (lat: number, lng: number) => {
    // 1. Update coordinates immediately for responsive UI
    setFormData((prev) => ({
      ...prev,
      lat: lat.toString(),
      lng: lng.toString(),
    }));

    // 2. Update internal location state
    setLocation({ latitude: lat, longitude: lng });

    // 3. Trigger reverse geocoding to auto-fill address details
    await reverseGeocode(lat, lng);
  };

  /**
   * Validates form inputs according to requirements.
   * Only pincode and address fields are validated as they are the only editable inputs.
   */
  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    // Detailed Address Validation
    if (!formData.address.trim()) {
      newErrors.address = 'Detailed address is required for deliveries';
    } else if (formData.address.trim().length < 8) {
      newErrors.address = 'Please provide a more specific address details';
    }

    // Pincode Validation (Standard 6-digit check)
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required to locate your area';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit area pincode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission with coordinates.
   */
  const handleSave = () => {
    try {
      if (validate()) {
        onSave(formData);
      }
    } catch (error) {
      // Structured logging as per requirements
      console.error(
        `[AddressForm] Submission error at ${new Date().toISOString()}:`,
        error,
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardView}
    >
      {/* Visual Header with handle indicator for bottom sheet feel */}
      <View style={styles.header}>
        <View style={styles.headerIndicator} />
        <View style={styles.headerRow}>
          <Text style={styles.title}>Update Address Details</Text>
          <TouchableOpacity
            onPress={onCancel}
            style={styles.closeButton}
            accessibilityLabel="Close form"
          >
            <Ionicons name="close" size={24} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* MAP COMPONENT */}
        {locationLoading ? (
          <View
            style={[
              styles.mapPlaceholder,
              { justifyContent: 'center', alignItems: 'center' },
            ]}
          >
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={{ marginTop: 10, color: '#6B7280' }}>
              Detecting Location...
            </Text>
          </View>
        ) : (
          <MapComponent
            latitude={parseFloat(formData.lat) || 0}
            longitude={parseFloat(formData.lng) || 0}
            onLocationSelect={handleLocationSelect}
          />
        )}
        {/* READ-ONLY: System Identifiers and Status */}
        {/* <View style={styles.systemInfoContainer}> */}
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: address?.is_active ? '#DEF7EC' : '#FDE8E8' },
            ]}
          >
            <Ionicons
              name={address?.is_active ? 'checkmark-circle' : 'close-circle'}
              size={14}
              color={address?.is_active ? '#03543F' : '#9B1C1C'}
            />
            <Text
              style={[
                styles.statusText,
                { color: address?.is_active ? '#03543F' : '#9B1C1C' },
              ]}
            >
              Address Status: {address?.is_active ? 'Active' : 'Inactive'}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: address?.isServiceable ? '#E1EFFE' : '#FEF3C7',
              },
            ]}
          >
            <Ionicons
              name="location"
              size={14}
              color={address?.isServiceable ? '#1E429F' : '#92400E'}
            />
            <Text
              style={[
                styles.statusText,
                { color: address?.isServiceable ? '#1E429F' : '#92400E' },
              ]}
            >
              Address Serviceability:{' '}
              {address?.isServiceable ? 'Serviceable' : 'No Service'}
            </Text>
          </View>
        </View>
        {/* </View> */}

        {/* EDITABLE: Detailed Address */}
        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.editableLabel}>Address</Text>
            <Ionicons name="pencil" size={14} color="#2563EB" />
          </View>
          <TextInput
            placeholder="e.g. Building, Street, Area details"
            value={formData.address}
            onChangeText={(text) => setFormData({ ...formData, address: text })}
            multiline
            numberOfLines={4}
            style={[
              styles.input,
              styles.textArea,
              errors.address && styles.inputError,
            ]}
            placeholderTextColor="#9CA3AF"
          />
          {errors.address && (
            <Text style={styles.errorText}>{errors.address}</Text>
          )}
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>City</Text>
            <View style={styles.readOnlyBox}>
              <Text style={styles.readOnlyText} numberOfLines={1}>
                {formData.city || 'Select on Map'}
              </Text>
            </View>
          </View>
          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>State</Text>
            <View style={styles.readOnlyBox}>
              <Text style={styles.readOnlyText} numberOfLines={1}>
                {formData.state || 'Select on Map'}
              </Text>
            </View>
          </View>
        </View>

        {/* EDITABLE: Pincode */}
        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.editableLabel}>Pincode</Text>
            <Ionicons name="pencil" size={14} color="#2563EB" />
          </View>
          <TextInput
            placeholder="Enter 6-digit pincode"
            value={formData.pincode}
            onChangeText={(text) =>
              setFormData({ ...formData, pincode: text.replace(/[^0-9]/g, '') })
            }
            keyboardType="numeric"
            maxLength={6}
            style={[styles.input, errors.pincode && styles.inputError]}
            placeholderTextColor="#9CA3AF"
          />
          {errors.pincode && (
            <Text style={styles.errorText}>{errors.pincode}</Text>
          )}
        </View>

        {/* SUBMISSION ACTION */}
        <TouchableOpacity
          style={[styles.saveButton, isPending && styles.disabledButton]}
          onPress={isPending ? () => {} : handleSave}
          activeOpacity={0.8}
          accessibilityRole="button"
        >
          {isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text style={styles.saveButtonText}>Apply Changes</Text>
              <Ionicons
                name="arrow-forward"
                size={18}
                color="white"
                style={{ marginLeft: 8 }}
              />
            </>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    width: '100%',
  },
  header: {
    paddingTop: 12,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerIndicator: {
    width: 36,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  closeButton: {
    padding: 6,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
  },
  container: {
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 80 : 60,
  },
  systemInfoContainer: {
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    width: 70,
  },
  infoValue: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
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
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    marginLeft: 2,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginLeft: 2,
  },
  editableLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginRight: 6,
  },
  readOnlyBox: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  readOnlyText: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    padding: 12,
    borderRadius: 14,
    fontSize: 16,
    color: '#111827',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 6,
    marginLeft: 4,
  },
  mockSection: {
    marginTop: 10,
    marginBottom: 24,
    padding: 14,
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
  },
  mockTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0369A1',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  mockItem: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  mockLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 2,
  },
  mockValue: {
    fontSize: 13,
    color: '#0369A1',
    fontWeight: '700',
  },
  saveButton: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  disabledButton: {
    backgroundColor: '#93C5FD',
    elevation: 0,
    shadowOpacity: 0,
  },
  mapPlaceholder: {
    height: 250,
    width: '100%',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
