import { AppProvider } from '@/core/providers/AppProvider';
import { useAuth } from '@/core/providers/AuthProvider';
import { toastConfig } from '@/core/ui/toastConfig';
import { AnimatedSplashScreen } from '@/shared/ui/AnimatedSplashScreen';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';

// Prevent splash from auto hiding
SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { loading } = useAuth();
  const [isAnimationFinished, setIsAnimationFinished] = useState(false);

  // We show the animated splash until BOTH auth loading is finished AND the animation itself is finished
  if (loading || !isAnimationFinished) {
    return (
      <AnimatedSplashScreen
        onAnimationFinish={() => setIsAnimationFinished(true)}
      />
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <RootNavigator />
        <Toast config={toastConfig} position="top" />
      </AppProvider>
    </GestureHandlerRootView>
  );
}
