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
import { initAdMob } from '@features/ads/utils/config';
import FullSizeLoading from '@components/common/FullSizeLoading';
import { View } from 'react-native';

// Mobile Ads SDK 초기화
initAdMob();

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
        <StatusBar style="dark" />
        <DatabaseUpdateView
          status={updateProgress.status}
          progress={updateProgress.progress}
          isUpdating={updateProgress.isUpdating}
        />
        <Toast config={toastConfig} position="bottom" bottomOffset={px(100)} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Layout>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </Layout>
      <MainNoticeBottomSheet />
      <FullSizeLoading />
      <View style={{ zIndex: 999999 }}>
        <Toast config={toastConfig} position="bottom" bottomOffset={px(100)} />
      </View>
    </SafeAreaProvider>
  );
};

export default RootLayout;
