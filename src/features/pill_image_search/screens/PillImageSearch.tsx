import React from 'react';
import { View, ScrollView } from 'react-native';
import ImageSearchContent from '../components/organisms/ImageSearchContent';
import ImageSearchButtons from '../components/organisms/ImageSearchButtons';
import { usePillImageSelection } from '../hooks/usePillImageSelection';
import FullSizeLoading from '@components/common/FullSizeLoading';
import { styles } from '../styles/PillImageSearch';
import CameraGuideModal from '../components/organisms/CameraGuideModal';
import { useCameraGuideModalStore } from '../store/camera_guide_store';

// TODO: Scroll 제거 필요 (ScrollView를 교체하던지 아니면 Scroll이 안되게 막던지)
// TODO: 검색 중 취소 로직 필요 (사용자의 뒤로가기, 외부에서 종료)

const PillImageSearch = () => {
  const {
    pillImages,
    isSearching,
    isBothImagesSelected,
    handleImageSelect,
    handleMultipleImageSelect,
    handleImageRemove,
    handleSearch,
  } = usePillImageSelection();

  const { isGuideModalVisible, setIsGuideModalVisible } =
    useCameraGuideModalStore();

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <ImageSearchContent
          frontImage={pillImages.front}
          backImage={pillImages.back}
          onRemove={handleImageRemove}
        />
        <View style={styles.hr} />
        <ImageSearchButtons
          visible={false}
          onImageSelect={handleImageSelect}
          onMultipleImageSelect={handleMultipleImageSelect}
          pillImages={pillImages}
          onApply={handleSearch}
          showApplyButton={isBothImagesSelected}
        />
      </View>
      <FullSizeLoading
        visible={isSearching}
        message="이미지를 분석하여 알약을 찾는 중입니다..."
      />
      <CameraGuideModal
        visible={isGuideModalVisible}
        onClose={() => setIsGuideModalVisible(false)}
      />
    </View>
  );
};

export default PillImageSearch;
