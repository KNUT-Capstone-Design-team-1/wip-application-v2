import React, { useEffect } from 'react';
import { View } from 'react-native';
import { styles } from './styles/_layout';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Layout from '@layouts/Layout';
import {
  useAppInitializer,
  DatabaseUpdateView,
  DatabaseUpdateModal,
} from '@features/database_update';
import MainNoticeBottomSheet from '@features/notice/components/MainNoticeBottomSheet';
import Toast from 'react-native-toast-message';
import toastConfig from '@components/config/toastConfig';
import { px } from '@utils/responsive';
import { initAdMob } from '@features/ads/utils/config';
import FullSizeLoading from '@components/common/FullSizeLoading';
import CommonModal from '@components/common/CommonModal';
import { pillReminderNotificationService } from '@features/pill_reminder/services/pill_reminder_notification_service';
import CameraGuideModal from '@features/pill_image_search/components/organisms/CameraGuideModal';
import ImageSelectBottomSheet from '@features/pill_image_search/components/organisms/ImageSelectBottomSheet';
import { preloadKoreanHolidays } from '@utils/korean_holidays';
import { logger } from '@utils/index';
import { GuideProvider, GuideOverlay } from '@features/guide';
import { guideStorage } from '@utils/guide_storage';

// Mobile Ads SDK 초기화
initAdMob();

/**
 * 앱의 최상위 레이아웃 컴포넌트
 * 앱 초기화 상태에 따라 데이터베이스 업데이트 화면 또는 메인 앱 화면을 렌더링
 */
const RootLayout = () => {
  const { isInitializing, updateProgress } = useAppInitializer();

  useEffect(() => {
    if (!isInitializing) {
      preloadKoreanHolidays().catch((e) => {
        logger.error(`korean holidays preload fail : ${e?.stack || e}`);
      });

      pillReminderNotificationService.startWatcher();

      return () => {
        pillReminderNotificationService.stopWatcher();
      };
    }
  }, [isInitializing]);

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
        <DatabaseUpdateModal />
        <Toast config={toastConfig} position="bottom" bottomOffset={px(100)} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <GuideProvider storage={guideStorage}>
        <Layout />
        <MainNoticeBottomSheet />
        <FullSizeLoading />
        <CommonModal />
        <CameraGuideModal />
        <ImageSelectBottomSheet />
        <View style={styles.toastContainer}>
          <Toast
            config={toastConfig}
            position="bottom"
            bottomOffset={px(100)}
          />
        </View>
        {/* 가이드 오버레이는 반드시 마지막에 — 같은 window/root 에서 측정 정렬 + 다른 모든 오버레이 위.
            feature별 Provider/Overlay 로 두면 Modal 좌표 misalignment 로 홀 위치가 어긋났던 이슈 때문에
            앱 루트에 1회만 둔다. */}
        <GuideOverlay />
      </GuideProvider>
    </SafeAreaProvider>
  );
};

export default RootLayout;
