import React from 'react';
import { View } from 'react-native';
import ImageSearchContent from '../components/organisms/ImageSearchContent';
import ImageLoadButtons from '../components/organisms/ImageLoadButtons';
import { styles } from '../styles/PillImageSearch';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ImageSearchInfo from '../components/organisms/ImageSearchInfo';
import ImageSearchButton from '../components/organisms/ImageSearchButton';
import { CameraPermissionAlert } from '../components/molecules/CameraPermissionAlert';
import { usePillImageStore } from '../store/pill_image_store';
import { usePillImageActions } from '../hooks/usePillImageActions';

// TODO: 검색 중 취소 로직 필요 (사용자의 뒤로가기, 외부에서 종료)

const PillImageSearch = () => {
  const insets = useSafeAreaInsets();
  const showPermissionAlert = usePillImageStore(
    (state) => state.showPermissionAlert,
  );
  const { handlePermissionAlertClose } = usePillImageActions();
  return (
    <View style={[styles.container, { marginBottom: insets.bottom }]}>
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

export default PillImageSearch;
