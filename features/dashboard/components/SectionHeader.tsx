import { Text, View } from 'react-native';

export function SectionHeader({ title }: { title: string }) {
  return (
    <View style={{ marginBottom: 8 }}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: '600',
          color: '#0F172A',
        }}
      >
        {title}
      </Text>
    </View>
  );
}
