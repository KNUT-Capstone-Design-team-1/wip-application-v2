import React from 'react';
import { View, ScrollView } from 'react-native';
import ImageSearchContent from '../components/organisms/ImageSearchContent';
import ImageSearchButtons from '../components/organisms/ImageSearchButtons';
import { usePillImageSelection } from '../hooks/usePillImageSelection';
import FullSizeLoading from '@components/common/FullSizeLoading';
import { styles } from '../styles/PillImageSearch';

// TODO: Scroll 제거 필요 (ScrollView를 교체하던지 아니면 Scroll이 안되게 막던지)
// TODO: 검색 중 취소 로직 필요 (사용자의 뒤로가기, 외부에서 종료)

const PillImageSearch = () => {
  const {
    pillImages,
    hasImage,
    isSearching,
    isBothImagesSelected,
    handleImageSelect,
    handleMultipleImageSelect,
    handleImageRemove,
    handleSearch,
  } = usePillImageSelection();

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <ImageSearchContent
          contentState={hasImage}
          frontImage={pillImages.front}
          backImage={pillImages.back}
        />
        <View style={styles.hr} />
        <ImageSearchButtons
          visible={false}
          onImageSelect={handleImageSelect}
          onMultipleImageSelect={handleMultipleImageSelect}
          pillImages={pillImages}
          onImageRemove={handleImageRemove}
          onApply={handleSearch}
          showApplyButton={isBothImagesSelected}
        />
      </ScrollView>
      <FullSizeLoading
        visible={isSearching}
        message="이미지를 분석하여 알약을 찾는 중입니다..."
      />
    </View>
  );
};

export default PillImageSearch;
