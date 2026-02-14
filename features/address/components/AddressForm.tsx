import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { AddressFormValues, addressSchema } from '../address.schema';
import { AddressFormData, AddressFormProps } from '../address.types';
import { useLocationLogic } from '../hooks/useLocationLogic';
import { AddressStatus } from './AddressStatus';
import { MapComponent } from './MapComponent';
import { StatePickerModal } from './StatePickerModal';
import { addressStyles as styles } from './address.style';

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

  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      pincode: address?.pincode || '',
      address: address?.address || '',
      city: address?.location?.name || '',
      state: address?.location?.state || '',
      lat: '',
      lng: '',
    },
  });

  const [formData, setFormData] = useState<AddressFormData>({
    pincode: address?.pincode || '',
    address: address?.address || '',
    city: address?.location?.name || '',
    state: address?.location?.state || '',
    lat: '',
    lng: '',
  });

  const [showStatePicker, setShowStatePicker] = useState(false);


  // Initialize form with address data if available
  useEffect(() => {
    if (address) {
      setFormData((prev) => {
        const newData = {
          ...prev,
          pincode: address.pincode,
          address: address.address,
          city: address.location?.name || '',
          state: address.location?.state || '',
          lat: prev.lat || '',
          lng: prev.lng || '',
        };

        // Sync with react-hook-form
        setValue('pincode', newData.pincode);
        setValue('address', newData.address);
        setValue('city', newData.city);
        setValue('state', newData.state);

        return newData;
      });

      // If we don't have coordinates, we could try to geocode the address or just get current location
      if (!formData.lat || !formData.lng) {
        requestPermissionAndGetCurrentLocation().then((loc) => {
          if (loc) {
            const lat = loc.latitude.toString();
            const lng = loc.longitude.toString();

            setFormData((prev) => ({
              ...prev,
              lat,
              lng,
            }));

            // Sync coordinates
            setValue('lat', lat);
            setValue('lng', lng);
          }
        });
      }
    } else {
      // If no address provided (new/empty), try to get current location
      requestPermissionAndGetCurrentLocation().then((loc) => {
        if (loc) {
          const lat = loc.latitude.toString();
          const lng = loc.longitude.toString();

          setFormData((prev) => ({
            ...prev,
            lat,
            lng,
          }));

          // Sync coordinates
          setValue('lat', lat);
          setValue('lng', lng);
        }
      });
    }
  }, [address]);

  // Update form when address details from geocoding change
  useEffect(() => {
    if (addressDetails.city || addressDetails.state || addressDetails.pincode) {
      const newCity = addressDetails.city || formData.city;
      const newState = addressDetails.state || formData.state;
      const newPincode = addressDetails.pincode || formData.pincode;

      setFormData((prev) => ({
        ...prev,
        city: newCity,
        state: newState,
        pincode: newPincode,
      }));

      // Sync with react-hook-form and trigger validation for these fields
      // Use shouldValidate: true to clear errors if the new value is valid
      if (addressDetails.city) setValue('city', newCity, { shouldValidate: true });
      if (addressDetails.state) setValue('state', newState, { shouldValidate: true });
      if (addressDetails.pincode) setValue('pincode', newPincode, { shouldValidate: true });
    }
  }, [addressDetails]);

  const handleLocationSelect = async (lat: number, lng: number) => {
    // 1. Update coordinates immediately for responsive UI
    setFormData((prev) => ({
      ...prev,
      lat: lat.toString(),
      lng: lng.toString(),
    }));

    // 2. Update form values for validation
    setValue('lat', lat.toString());
    setValue('lng', lng.toString());

    // 3. Update internal location state
    setLocation({ latitude: lat, longitude: lng });

    // 4. Trigger reverse geocoding to auto-fill address details
    await reverseGeocode(lat, lng);
  };

  /**
   * Handles form submission with Zod schema validation.
   */
  const onSubmit = (data: AddressFormValues) => {
    try {
      // Merge formData with validated data (includes lat/lng from react-hook-form)
      const payload: AddressFormData = {
        ...data,
        lat: formData.lat,
        lng: formData.lng,
      };
      onSave(payload);
    } catch (error) {
      // Structured logging as per requirements
      console.error(
        `[AddressForm] Submission error at ${new Date().toISOString()}:`,
        error,
      );
    }
  };

  return (
    <>
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
            <View style={styles.mapPlaceholderCentered}>
              <ActivityIndicator size="large" color="#2563EB" />
              <Text style={styles.locationDetectingText}>
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
          <AddressStatus address={address} />

          {/* EDITABLE: Detailed Address */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.editableLabel}>Address</Text>
              <Ionicons name="pencil" size={14} color="#2563EB" />
            </View>
            <TextInput
              placeholder="e.g. Building, Street, Area details"
              value={formData.address}
              onChangeText={(text) => {
                setFormData({ ...formData, address: text });
                setValue('address', text);
              }}
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
              <Text style={styles.label}>City</Text>
              {/* If reverse geocoding fails (empty city), allow manual entry */}
              {!address?.location?.name ? (
                <TextInput
                  placeholder="Enter City"
                  value={formData.city}
                  onChangeText={(text) => {
                    setFormData({ ...formData, city: text });
                    setValue('city', text);
                  }}
                  style={[styles.input, errors.city && styles.inputError]}
                  placeholderTextColor="#9CA3AF"
                />
              ) : (
                <View style={styles.readOnlyBox}>
                  <Text style={styles.readOnlyText} numberOfLines={1}>
                    {formData.city || 'Select on Map'}
                  </Text>
                </View>
              )}
              {errors.city && <Text style={styles.errorText}>{errors.city.message}</Text>}
            </View>

            <View style={styles.inputGroupRight}>
              <Text style={styles.label}>State</Text>
              {/* If reverse geocoding fails (empty state), allow manual selection */}
              {!address?.location?.state ? (
                <>
                  <TouchableOpacity
                    style={[styles.input, styles.pickerButton, errors.state && styles.inputError]}
                    onPress={() => setShowStatePicker(true)}
                  >
                    <Text style={!formData.state ? styles.pickerButtonPlaceholder : styles.pickerButtonText}>
                      {formData.state || 'Select State'}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#6B7280" />
                  </TouchableOpacity>
                  {errors.state && <Text style={styles.errorText}>{errors.state.message}</Text>}
                </>
              ) : (
                <View style={styles.readOnlyBox}>
                  <Text style={styles.readOnlyText} numberOfLines={1}>
                    {formData.state || 'Select on Map'}
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
              value={formData.pincode}
              onChangeText={(text) => {
                const numericText = text.replace(/[^0-9]/g, '');
                setFormData({ ...formData, pincode: numericText });
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
          <TouchableOpacity
            style={[styles.saveButton, isPending && styles.disabledButton]}
            onPress={isPending ? () => { } : handleSubmit(onSubmit)}
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
                  style={styles.iconMargin}
                />
              </>
            )}
          </TouchableOpacity>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* State Selection Modal */}
      <StatePickerModal
        visible={showStatePicker}
        selectedState={formData.state}
        onSelectState={(state) => {
          setFormData({ ...formData, state });
          setValue('state', state);
        }}
        onClose={() => setShowStatePicker(false)}
      />
    </>
  );
}
