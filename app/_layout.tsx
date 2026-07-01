import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Layout from '@layouts/Layout';
import {
  useAppInitializer,
  DatabaseUpdateView,
} from '@features/database_update';
import MainNoticeBottomSheet from '@features/notice/components/MainNoticeBottomSheet';
import Toast from 'react-native-toast-message';
import toastConfig from '@components/config/toastConfig';
import { px } from '@utils/responsive';

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
        <Toast config={toastConfig} position="bottom" bottomOffset={px(100)} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Layout>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </Layout>
      <MainNoticeBottomSheet />
      <Toast config={toastConfig} position="bottom" bottomOffset={px(100)} />
    </SafeAreaProvider>
  );
};

export default RootLayout;
