import { getToken } from '@/core/storage/secureStorage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function AppEntry() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const token = await getToken();

      if (token) {
        router.replace('/dashboard'); 
      } else {
        router.replace('/auth/login');
      }

      setLoading(false);
    }

    checkAuth();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return null;
}
