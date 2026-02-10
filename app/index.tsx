import { getToken } from '@/core/storage/secureStorage';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function AppEntry() {
  useEffect(() => {
    async function bootstrap() {
      const token = await getToken();
      if (token) {
        router.replace('/(protected)/(tabs)/dashboard');
      } else {
        router.replace('/(auth)/login');
      }
    }

    bootstrap();
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-black">
      <ActivityIndicator size="large" />
    </View>
  );
}
