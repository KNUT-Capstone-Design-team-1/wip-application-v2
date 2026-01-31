import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { initDatabase, IUpdateProgress } from '../src/services/database';
import Layout from '../src/layouts/Layout';
import { logger } from '../src/utils';
import UpdateDB from './UpdateDB';

/**
 * 전역 스크린 옵션
 * @returns
 */
const RootLayout = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [updateProgress, setUpdateProgress] = useState<any>({
    status: 'DB 초기화 중',
    progress: 0,
  });

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await initDatabase((progress) => {
          setUpdateProgress(progress);
        });
        // 초기화 완료 후 잠시 대기
        setTimeout(() => {
          setIsInitializing(false);
        }, 500);
      } catch (error) {
        logger.error(`Failed to init Database. error: ${error}`);
        setIsInitializing(false);
      }
    };

    initializeDatabase();
  }, []);

  // 초기화 중이면 로딩 화면 표시
  if (isInitializing) {
    return (
      <SafeAreaProvider>
        <UpdateDB
          status={updateProgress.status}
          progress={updateProgress.progress}
          currentPage={updateProgress.currentPage}
          totalPages={updateProgress.totalPages}
        />
      </SafeAreaProvider>
    );
  }

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
