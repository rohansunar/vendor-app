import { Text, View } from 'react-native';

export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text
        style={{
          fontSize: 12,
          color: '#64748B',
        }}
      >
        {label}
      </Text>

      <Text
        style={{
          fontSize: 15,
          fontWeight: '600',
          color: '#0F172A',
        }}
      >
        {value}
      </Text>
    </View>
  );
}
