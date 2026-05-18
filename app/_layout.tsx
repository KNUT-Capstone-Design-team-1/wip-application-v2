import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Layout from '@layouts/Layout';
import {
  useAppInitializer,
  DatabaseUpdateView,
} from '@features/database_update';

/**
 * 앱의 최상위 레이아웃 컴포넌트
 * 앱 초기화 상태에 따라 데이터베이스 업데이트 화면 또는 메인 앱 화면을 렌더링
 */
const RootLayout = () => {
  const { isInitializing, updateProgress } = useAppInitializer();

  // 초기화 중이면 로딩 화면 표시
  if (isInitializing) {
    return (
      <SafeAreaProvider>
        <DatabaseUpdateView
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
