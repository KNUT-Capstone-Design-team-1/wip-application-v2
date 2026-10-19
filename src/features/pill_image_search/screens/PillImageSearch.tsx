import React, { useCallback } from 'react';
import { View, Pressable } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { CircleQuestionMark } from 'lucide-react-native';
import ImageSearchContent from '../components/organisms/ImageSearchContent';
import ImageLoadButtons from '../components/organisms/ImageLoadButtons';
import { styles } from '../styles/PillImageSearch';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ImageSearchInfo from '../components/organisms/ImageSearchInfo';
import ImageSearchButton from '../components/organisms/ImageSearchButton';
import { CameraPermissionAlert } from '../components/molecules/CameraPermissionAlert';
import { usePillImageStore } from '../store/pill_image_store';
import { usePillImageActions } from '../hooks/usePillImageActions';
import { GuideProvider, GuideOverlay, useGuide } from '@features/guide';
import { guideStorage } from '@utils/guide_storage';
import { COLOR } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { IMAGE_TOUR } from '../constants/image_tour_constant';

// TODO: 검색 중 취소 로직 필요 (사용자의 뒤로가기, 외부에서 종료)

const PillImageSearchContent = () => {
  const insets = useSafeAreaInsets();
  const showPermissionAlert = usePillImageStore(
    (state) => state.showPermissionAlert,
  );
  const { handlePermissionAlertClose } = usePillImageActions();
  const { start, autoStart } = useGuide();

  // 첫 진입 시 1회 자동 노출 (AsyncStorage 저장)
  useFocusEffect(
    useCallback(() => {
      autoStart(IMAGE_TOUR);
    }, [autoStart]),
  );

  return (
    <View style={[styles.container, { marginBottom: insets.bottom }]}>
      {/* 가이드 다시보기 버튼 */}
      <Pressable
        onPress={() => start(IMAGE_TOUR)}
        hitSlop={8}
        style={styles.guideButton}
        accessibilityRole="button"
        accessibilityLabel="사용법 보기"
      >
        <CircleQuestionMark size={fontPx(22)} color={COLOR['secondary']} />
      </Pressable>

      <View style={styles.contentContainer}>
        <ImageSearchContent />
        <View style={styles.hr} />
        <ImageLoadButtons />
      </View>
      <ImageSearchInfo />
      {/* 검색하기 버튼 */}
      <ImageSearchButton />
      <CameraPermissionAlert
        visible={showPermissionAlert}
        onClose={handlePermissionAlertClose}
        onCancel={handlePermissionAlertClose}
      />
    </View>
  );
};

const PillImageSearch = () => {
  return (
    <GuideProvider storage={guideStorage}>
      <PillImageSearchContent />
      {/* 스포트라이트 오버레이 (Provider 안에 1회) */}
      <GuideOverlay />
    </GuideProvider>
  );
};

export default PillImageSearch;
