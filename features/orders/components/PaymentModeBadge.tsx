import { Text, View } from 'react-native';

export function PaymentModeBadge({ mode }: { mode: string }) {
  const isCOD = mode === 'COD';

  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: isCOD ? '#FEF3C7' : '#DBEAFE',
      }}
    >
      <Text
        style={{
          color: isCOD ? '#B45309' : '#1D4ED8',
          fontSize: 12,
          fontWeight: '600',
        }}
      >
        {mode}
      </Text>
    </View>
  );
}
