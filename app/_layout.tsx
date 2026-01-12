import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { initDatabase } from './database';

/**
 * 전역 스크린 옵션
 * @returns
 */
const RootLayout = () => {
  useEffect(() => {
    initDatabase().catch(console.error); // 데이터베이스 초기화
  }, []);

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" options={{ title: '홈' }} />
      </Stack>
    </SafeAreaProvider>
  );
};

export default RootLayout;
