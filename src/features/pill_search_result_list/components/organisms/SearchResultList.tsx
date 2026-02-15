import { useEffect, useCallback, memo, useRef } from 'react';
import { View, FlatList } from 'react-native';
import SearchResultItem from '../molecules/SearchResultItem';
import { styles } from '../../styles/organisms/SearchResultList';
import { usePillSearch } from '@/src/hooks/use_pill_search';
import { usePillSearchResultList } from '../../hooks/use_pill_search_result_list';

interface ISearchResultData {
  searchResultData: any[];
}

const SearchResultList = ({ searchResultData }: ISearchResultData) => {
  // const { loadMorePills } = usePillSearch();
  const previousDataLength = useRef(searchResultData.length);
  const { searchItemClickHandler } = usePillSearchResultList();

  useEffect(() => {
    const isNewDataAdded = searchResultData.length > previousDataLength.current;
    console.log('🔄 SearchResultList 리렌더링 - 데이터 개수:', searchResultData.length, isNewDataAdded ? '(데이터 추가됨)' : '');
    previousDataLength.current = searchResultData.length;
  }, [searchResultData]);

  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => (
      <View style={index === 0 ? { marginTop: -10 } : undefined}>
        <SearchResultItem
          resultItem={item}
          itemClickHandler={() =>
            searchItemClickHandler(item.ITEM_SEQ, item.ITEM_IMAGE)
          }
        />
      </View>
    ),
    [searchItemClickHandler],
  );

  const renderSeparator = useCallback(() => <View style={styles.hr} />, []);

  const keyExtractor = useCallback(
    (item: any, index: number) => {
    // ITEM_SEQ를 우선 사용하여 안정적인 key 보장
    if (item.ITEM_SEQ) {
      return String(item.ITEM_SEQ);
    }
    // ITEM_SEQ가 없는 경우 여러 필드 조합으로 고유 key 생성
    return `pill-${item.ITEM_NAME || 'unknown'}-${item.ENTP_NAME || ''}-${index}`;
  }, []);

  // const handleLoadMore = useCallback(() => {
  //   loadMorePills();
  // }, [loadMorePills]);

  const handleLoadMore = () => {
    console.log('123');
  };

  return (
    <FlatList
      style={styles.searchResultListWrapper}
      data={searchResultData}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ItemSeparatorComponent={renderSeparator}
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={true}
      // 무한 스크롤 설정
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      // 성능 최적화
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
      removeClippedSubviews={true} // 화면 밖 아이템 메모리에서 제거
      // 리스트 업데이트 시 불필요한 스크롤 방지
      getItemLayout={(data, index) => ({
        length: 100, // 아이템의 평균 높이 (실제 값에 맞게 조정 필요)
        offset: 100 * index,
        index,
      })}
    />
  );
};

// 깊은 비교로 불필요한 리렌더링 방지
export default memo(SearchResultList, (prevProps, nextProps) => {
  // 데이터 길이와 참조가 같으면 리렌더링하지 않음
  return prevProps.searchResultData === nextProps.searchResultData;
});
