import { GradientButton } from '@/shared/ui/GradientButton';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Toast from 'react-native-toast-message';
import { AddressFormValues, addressSchema } from '../address.schema';
import { AddressFormProps } from '../address.types';
import { useLocationLogic } from '../hooks/useLocationLogic';
import { AddressStatus } from './AddressStatus';
import { StatePickerModal } from './StatePickerModal';
import { addressStyles as styles } from './address.style';

/**
 * AddressForm component for updating delivery address.
 * Adheres to requirements: restricted editing (only address and pincode),
 *
 * Simplification: Uses only react-hook-form state management.
 * No redundant local state - useWatch() for rendering and getValues() for submission.
 */
export function AddressForm({
  address,
  onSave,
  onCancel,
  isPending,
}: AddressFormProps) {
  const {
    addressDetails,
    loading: locationLoading,
    requestPermissionAndGetCurrentLocation,
    reverseGeocode,
    setLocation,
  } = useLocationLogic();

  const {
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      pincode: address?.pincode || '',
      address: address?.address || '',
      city: address?.location?.name || '',
      state: address?.location?.state || '',
      lat: address?.location?.lat?.toString() || '',
      lng: address?.location?.lng?.toString() || '',
    },
  });

  // Watch form values for rendering - replaces redundant formData state
  const formValues = useWatch({ control });

  const [showStatePicker, setShowStatePicker] = useState(false);

  // Initialize form with address data and get location if needed
  // Note: Intentional - only run when address prop changes, not on every render
  useEffect(() => {
    const hasExistingCoordinates =
      address?.location?.lat && address?.location?.lng;
    const hasCoordinatesInForm = formValues.lat && formValues.lng;

    // Only fetch current location if we DON'T have valid coordinates
    if (!hasExistingCoordinates && !hasCoordinatesInForm) {
      requestPermissionAndGetCurrentLocation().then((loc) => {
        if (loc) {
          const lat = loc.latitude.toString();
          const lng = loc.longitude.toString();
          setValue('lat', lat);
          setValue('lng', lng);
          setLocation({ latitude: loc.latitude, longitude: loc.longitude });
        }
      });
    }
  }, [address]);

  // Update form when address details from geocoding change
  // Note: Intentional - only run when addressDetails change, setValue is stable
  useEffect(() => {
    if (addressDetails.city) {
      setValue('city', addressDetails.city, { shouldValidate: true });
    }
    if (addressDetails.state) {
      setValue('state', addressDetails.state, { shouldValidate: true });
    }
    if (addressDetails.pincode) {
      setValue('pincode', addressDetails.pincode, { shouldValidate: true });
    }
  }, [addressDetails]);

  const handleLocationSelect = async (lat: number, lng: number) => {
    // 1. Update form values for validation
    setValue('lat', lat.toString());
    setValue('lng', lng.toString());

    // 2. Update internal location state
    setLocation({ latitude: lat, longitude: lng });

    // 3. Trigger reverse geocoding to auto-fill address details
    await reverseGeocode(lat, lng);
  };

  /**
   * Handles form submission with Zod schema validation.
   */
  const onSubmit = (data: AddressFormValues) => {
    try {
      // Ensure lat/lng are always strings (not undefined) to match AddressFormData
      const payload = {
        address: data.address,
        pincode: data.pincode,
        city: data.city,
        state: data.state,
        lat: data.lat || '',
        lng: data.lng || '',
      };
      onSave(payload);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Form submission failed',
        text2: error.message || 'Please check your input',
      });
    }
  };

  return (
    <>
      <View
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
          keyboardShouldPersistTaps="handled"
        >
          {/* MAP COMPONENT - Commented out as per requirement to not render maps for now */}
          {/* 
          {locationLoading ? (
            <View style={styles.mapPlaceholderCentered}>
              <ActivityIndicator size="large" color="#2563EB" />
              <Text style={styles.locationDetectingText}>
                Detecting Location...
              </Text>
            </View>
          ) : (
            <MapComponent
              latitude={parseFloat(formValues.lat || '0')}
              longitude={parseFloat(formValues.lng || '0')}
              onLocationSelect={handleLocationSelect}
            />
          )}
          */}
          {/* READ-ONLY: System Identifiers and Status */}
          <AddressStatus address={address} />

          {/* EDITABLE: Detailed Address */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.editableLabel}>Address</Text>
              <Ionicons name="pencil" size={14} color="#2563EB" />
            </View>
            <TextInput
              placeholder="e.g. Building, Street, Area details"
              value={formValues.address || ''}
              onChangeText={(text) => setValue('address', text)}
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
              <Text style={styles.errorText}>{errors.address.message}</Text>
            )}
          </View>

          <View style={styles.row}>
            <View style={styles.inputGroupLeft}>
              <Text style={styles.label}>City/Town</Text>
              {/* If reverse geocoding fails (empty city), allow manual entry */}
              {!address?.location?.name ? (
                <TextInput
                  placeholder="Enter City"
                  value={formValues.city || ''}
                  onChangeText={(text) => setValue('city', text)}
                  style={[styles.input, errors.city && styles.inputError]}
                  placeholderTextColor="#9CA3AF"
                />
              ) : (
                <View style={styles.readOnlyBox}>
                  <Text style={styles.readOnlyText} numberOfLines={1}>
                    {formValues.city || 'Select on Map'}
                  </Text>
                </View>
              )}
              {errors.city && (
                <Text style={styles.errorText}>{errors.city.message}</Text>
              )}
            </View>

            <View style={styles.inputGroupRight}>
              <Text style={styles.label}>State</Text>
              {/* If reverse geocoding fails (empty state), allow manual selection */}
              {!address?.location?.state ? (
                <>
                  <TouchableOpacity
                    style={[
                      styles.input,
                      styles.pickerButton,
                      errors.state && styles.inputError,
                    ]}
                    onPress={() => setShowStatePicker(true)}
                  >
                    <Text
                      style={
                        !formValues.state
                          ? styles.pickerButtonPlaceholder
                          : styles.pickerButtonText
                      }
                    >
                      {formValues.state || 'Select State'}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#6B7280" />
                  </TouchableOpacity>
                  {errors.state && (
                    <Text style={styles.errorText}>{errors.state.message}</Text>
                  )}
                </>
              ) : (
                <View style={styles.readOnlyBox}>
                  <Text style={styles.readOnlyText} numberOfLines={1}>
                    {formValues.state || 'Select on Map'}
                  </Text>
                </View>
              )}
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
              value={formValues.pincode || ''}
              onChangeText={(text) => {
                const numericText = text.replace(/[^0-9]/g, '');
                setValue('pincode', numericText);
              }}
              keyboardType="numeric"
              maxLength={6}
              style={[styles.input, errors.pincode && styles.inputError]}
              placeholderTextColor="#9CA3AF"
            />
            {errors.pincode && (
              <Text style={styles.errorText}>{errors.pincode.message}</Text>
            )}
          </View>

          {/* SUBMISSION ACTION */}
          <GradientButton
            title="Save Changes"
            onPress={handleSubmit(onSubmit)}
            loading={isPending}
          />

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>

      {/* State Selection Modal */}
      <StatePickerModal
        visible={showStatePicker}
        selectedState={formValues.state || ''}
        onSelectState={(state) => setValue('state', state)}
        onClose={() => setShowStatePicker(false)}
      />
    </>
  );
}
