import React from 'react';
import { View } from 'react-native';
import ImageSearchContent from '../components/organisms/ImageSearchContent';
import ImageLoadButtons from '../components/organisms/ImageLoadButtons';
import { styles } from '../styles/PillImageSearch';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ImageSearchInfo from '../components/organisms/ImageSearchInfo';
import ImageSearchButton from '../components/organisms/ImageSearchButton';

// TODO: 검색 중 취소 로직 필요 (사용자의 뒤로가기, 외부에서 종료)

const PillImageSearch = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { marginBottom: insets.bottom }]}>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
        }}
      >
        <ImageSearchContent />
        <View style={styles.hr} />
        <ImageLoadButtons />
      </View>
      <ImageSearchInfo />
      {/* 검색하기 버튼 */}
      <ImageSearchButton />
    </View>
  );
};

export default PillImageSearch;
