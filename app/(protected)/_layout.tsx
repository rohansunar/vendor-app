import { getToken } from '@/core/storage/secureStorage';
import { Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function ProtectedLayout() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const token = await getToken();

      if (!token) {
        router.replace('/(auth)/login');
      }

      setChecking(false);
    }

    checkAuth();
  }, []);

  if (checking) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
