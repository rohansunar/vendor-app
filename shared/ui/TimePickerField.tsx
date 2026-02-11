import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import {
    Pressable,
    Text,
    View
} from 'react-native';

export function TimePickerField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (time: string) => void;
}) {
  const [show, setShow] = useState(false);

  function handleChange(event: any, selectedDate?: Date) {
    setShow(false);
    if (selectedDate) {
      const hours = selectedDate.getHours()
        .toString()
        .padStart(2, '0');
      const minutes = selectedDate.getMinutes()
        .toString()
        .padStart(2, '0');
      onChange(`${hours}:${minutes}`);
    }
  }

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 13, marginBottom: 6 }}>
        {label}
      </Text>

      <Pressable
        onPress={() => setShow(true)}
        style={{
          borderWidth: 1,
          borderColor: '#CBD5E1',
          borderRadius: 14,
          padding: 12,
        }}
      >
        <Text>{value || 'Select time'}</Text>
      </Pressable>

      {show && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          display="default"
          onChange={handleChange}
        />
      )}
    </View>
  );
}
