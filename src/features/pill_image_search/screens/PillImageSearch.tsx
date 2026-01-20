import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import ImageSearchContent from '../components/organisms/ImageSearchContent';
import ImageSearchButtons from '../components/organisms/ImageSearchButtons';
import { COLOR_GRAY } from '../../../constants/color';
import { usePillImageSelection } from '../hooks/usePillImageSelection';

const PillImageSearch = () => {
  const {
    pillImages,
    hasImage,
    isBothImagesSelected,
    handleImageSelect,
    handleMultipleImageSelect,
    handleImageRemove,
    handleSearch,
  } = usePillImageSelection();

  return (
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
});

export default PillImageSearch;
