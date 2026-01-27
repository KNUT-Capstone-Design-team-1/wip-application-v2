import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { initDatabase } from '../src/services/database';
import Layout from '../src/layouts/Layout';
import { logger } from '../src/utils';

/**
 * 전역 스크린 옵션
 * @returns
 */
const RootLayout = () => {
  useEffect(() => {
    initDatabase().catch((e) => {
      logger.error(`Failed to init Database. error: ${e}`);
    }); // 데이터베이스 초기화
  }, []);

  return (
    <SafeAreaProvider>
      <Layout>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ title: '홈' }} />
        </Stack>
      </Layout>
    </SafeAreaProvider>
  );
};

export default RootLayout;
