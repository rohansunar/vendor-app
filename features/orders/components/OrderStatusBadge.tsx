import { Text, View } from 'react-native';

export function OrderStatusBadge({
  label,
  color,
}: {
  label: string;
  color: string;
}) {
  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: `${color}20`,
      }}
    >
      <Text
        style={{
          color,
          fontSize: 12,
          fontWeight: '600',
        }}
      >
        {label}
      </Text>
    </View>
  );
}
