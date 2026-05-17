import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import Layout from '@layouts/Layout';
import UpdateDB from './UpdateDB';
import { useAppInitializer } from '@hooks/use_app_initializer';

export interface IUpdateProgress {
  status: string;
  progress: number;
  currentPage?: number;
  totalPages?: number;
}

/**
 * 전역 스크린 옵션
 * @returns
 */
const RootLayout = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [updateProgress, setUpdateProgress] = useState<IUpdateProgress>({
    status: 'DB 초기화 중',
    progress: 0,
  });
  const { initializeDataBase } = useAppInitializer();

  useEffect(() => {
    initializeDataBase(setUpdateProgress, setIsInitializing);
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
