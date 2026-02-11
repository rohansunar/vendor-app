import { GradientButton } from '@/shared/ui/GradientButton';
import { TimePickerField } from '@/shared/ui/TimePickerField';
import { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { VendorProfile } from '../profile.types';
import { AvailabilityToggle } from './AvailabilityToggle';
import { OperatingDaysSelector } from './OperatingDaysSelector';
import { profileStyles } from './profile.styles';

type Props = {
  data: VendorProfile;
  onSave: (payload: VendorProfile) => void;
  loading: boolean;
};

export function ProfileForm({ data, onSave, loading }: Props) {
  const [form, setForm] = useState(data);

  useEffect(() => {
    setForm(data);
  }, [data]);

  return (
    <View style={profileStyles.card}>
      <Text style={profileStyles.sectionTitle}>Business Details</Text>

      {/* Editable Fields */}
      <Text style={profileStyles.label}>Owner Name</Text>
      <TextInput
        value={form.name}
        onChangeText={(name) => setForm({ ...form, name })}
        style={profileStyles.input}
      />

      <Text style={profileStyles.label}>Business Name</Text>
      <TextInput
        value={form.business_name}
        onChangeText={(business_name) => setForm({ ...form, business_name })}
        style={profileStyles.input}
      />

      {/* Read-only Fields */}
      <Text style={profileStyles.label}>Phone</Text>
      <TextInput
        value={form.phone}
        editable={false}
        style={profileStyles.inputDisabled}
      />

      <Text style={profileStyles.label}>Email</Text>
      <TextInput
        value={form.email}
        editable={false}
        style={profileStyles.inputDisabled}
      />

      {/* Availability */}
      <AvailabilityToggle value={form.is_available_today} />

      {/* Business Hours */}
      <View style={profileStyles.timeRow}>
        <View style={profileStyles.timeInputWrapper}>
          <TimePickerField
            label="Opening Time"
            value={form.openingTime}
            onChange={(time) =>
              setForm({
                ...form,
                openingTime: time,
              })
            }
          />
        </View>

        <View style={profileStyles.timeInputWrapper}>
          <TimePickerField
            label="Closing Time"
            value={form.closingTime}
            onChange={(time) =>
              setForm({
                ...form,
                closingTime: time,
              })
            }
          />
        </View>
      </View>

      {/* Operating Days */}
      <OperatingDaysSelector
        value={form.operatingDays}
        onChange={(days) => setForm({ ...form, operatingDays: days })}
      />

      <GradientButton
        title="Save Changes"
        loading={loading}
        onPress={() => onSave(form)}
      />
    </View>
  );
}
