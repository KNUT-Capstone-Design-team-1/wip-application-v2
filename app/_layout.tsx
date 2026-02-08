import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { initDatabase } from '../src/services/database';
import Layout from '../src/layouts/Layout';
import { logger } from '../src/utils';
import UpdateDB from './UpdateDB';

// FIXME 커스텀 훅으로 옮기고 useEffect를 커스텀 훅으로 대체해야한다
export interface IUpdateProgress {
  status: string;
  progress: number;
  currentPage?: number;
  totalPages?: number;
}

const DATABASE_INIT_STATUS = {
  COMPLETE: 'COMPLETE',
} as const;

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
        const result = await initDatabase();

        if (result) {
          setUpdateProgress({
            status: DATABASE_INIT_STATUS.COMPLETE,
            progress: 1,
          });
        }

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
