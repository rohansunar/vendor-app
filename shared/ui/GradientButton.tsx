import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, Text } from 'react-native';

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export function GradientButton({ title, onPress, loading, disabled }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={{ marginTop: 24 }}
    >
      <LinearGradient
        colors={['#2563EB', '#1D4ED8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          height: 54,
          borderRadius: 14,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled || loading ? 0.6 : 1,
        }}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 16,
              fontWeight: '600',
            }}
          >
            {title}
          </Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}
