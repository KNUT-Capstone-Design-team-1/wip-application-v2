import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import ImageSearchContent from '../components/organisms/ImageSearchContent';
import ImageSearchButtons from '../components/organisms/ImageSearchButtons';
import { COLOR_GRAY } from '../../../constants';
import { usePillImageSelection } from '../hooks/usePillImageSelection';
import FullSizeLoading from '@components/common/FullSizeLoading';

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
        <View style={styles.hr}></View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingHorizontal: '5%',
    paddingBottom: 40,
  },
  hr: {
    width: '100%',
    height: 1,
    backgroundColor: COLOR_GRAY[150],
    marginTop: 30,
    marginBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
});

export default PillImageSearch;
