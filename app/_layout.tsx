import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

/**
 * 전역 스크린 옵션
 * @returns
 */
const RootLayout = () => {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" options={{ title: '홈' }} />
      </Stack>
    </SafeAreaProvider>
  );
};

export default RootLayout;
