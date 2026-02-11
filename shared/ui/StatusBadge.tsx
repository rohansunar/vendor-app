import { Text, View } from 'react-native';

export function StatusBadge({
  label,
  active,
}: {
  label: string;
  active: boolean;
}) {
  return (
    <View
      style={{
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        backgroundColor: active
          ? '#DCFCE7'
          : '#FEE2E2',
      }}
    >
      <Text
        style={{
          color: active ? '#16A34A' : '#DC2626',
          fontWeight: '600',
          fontSize: 12,
        }}
      >
        {label}: {active ? 'Yes' : 'No'}
      </Text>
    </View>
  );
}
