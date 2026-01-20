import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import ImageSearchSlideContainer from '../components/ImageSearchSlideContainer';
import ImageSearchContent from '@/app/features/pill_image_search/components/organisms/ImageSearchContent';
import ImageSearchButtons from '../components/organisms/ImageSearchButtons';
import { COLOR_GRAY } from "@/app/constants/color";

const PillImageSearch = () => {
  return (
    // onChange 이벤트가 발생하면 setSlideIndex 값 갱신하도록 하기
    <View style={styles.container}>
      <ImageSearchContent contentState={false} />
      <View style={styles.hr}></View>
      <ImageSearchButtons visible={false} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: '5%',
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
