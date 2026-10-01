import { memo } from 'react';
import { View } from 'react-native';
import { styles } from '@features/pill_search_result_list/styles/molecules/SearchResultAdSkeleton';

/**
 * SearchResultItem 구조와 동일한 가벼운 플랫 스켈레톤 (스크롤 부하 방지를 위해 순수 View로 구성)
 */
const SearchResultAdSkeleton = () => {
  return (
    <View style={styles.skeletonWrapper}>
      <View style={styles.skeletonImage} />
      <View style={styles.skeletonContents}>
        <View style={[styles.skeletonLine, styles.skeletonLineHeader]} />
        <View style={[styles.skeletonLine, styles.skeletonLineAdvertiser]} />
        <View style={[styles.skeletonLine, styles.skeletonLineBody]} />
        <View style={styles.skeletonBottomWrapper}>
          <View style={styles.skeletonLineRating} />
          <View style={styles.skeletonLineCta} />
        </View>
      </View>
    </View>
  );
};

export default memo(SearchResultAdSkeleton);
