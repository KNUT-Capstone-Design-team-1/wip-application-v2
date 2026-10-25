import React from 'react';
import { View, Pressable } from 'react-native';
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
import { COLOR } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { imageSearchGuide } from '../guide';

// TODO: 검색 중 취소 로직 필요 (사용자의 뒤로가기, 외부에서 종료)

const PillImageSearch = () => {
  const insets = useSafeAreaInsets();
  const showPermissionAlert = usePillImageStore(
    (state) => state.showPermissionAlert,
  );
  const { handlePermissionAlertClose } = usePillImageActions();
  const replay = imageSearchGuide.useReplay();

  return (
    <View style={[styles.container, { marginBottom: insets.bottom }]}>
      <Pressable
        onPress={replay}
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
      <ImageSearchButton />
      <CameraPermissionAlert
        visible={showPermissionAlert}
        onClose={handlePermissionAlertClose}
        onCancel={handlePermissionAlertClose}
      />
    </View>
  );
};

export default imageSearchGuide.wrap(PillImageSearch);
