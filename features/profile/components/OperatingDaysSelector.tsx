import { Pressable, Text, View } from 'react-native';

const DAYS = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
];

export function OperatingDaysSelector({
  value,
  onChange,
}: {
  value: string[];
  onChange: (days: string[]) => void;
}) {
  function toggle(day: string) {
    if (value.includes(day)) {
      onChange(value.filter((d) => d !== day));
    } else {
      onChange([...value, day]);
    }
  }

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ marginBottom: 8 }}>Operating Days</Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {DAYS.map((day) => {
          const active = value.includes(day);

          return (
            <Pressable
              key={day}
              onPress={() => toggle(day)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 20,
                borderWidth: 1,
                marginRight: 8,
                marginBottom: 8,
                backgroundColor: active ? '#2563EB' : '#FFFFFF',
                borderColor: active ? '#2563EB' : '#CBD5E1',
              }}
            >
              <Text
                style={{
                  color: active ? '#FFFFFF' : '#334155',
                }}
              >
                {day.toLowerCase().charAt(0).toUpperCase() +
                  day.toLowerCase().slice(1, 3)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
