import { useEffect, useCallback, memo, useRef } from 'react';
import { View, FlatList } from 'react-native';
import SearchResultItem from '../molecules/SearchResultItem';
import { styles } from '../../styles/organisms/SearchResultList';
import { usePillSearch } from '@hooks/use_pill_search';
import { usePillSearchResultList } from '../../hooks/use_pill_search_result_list';
import { ISearchResultData } from '@features/pill_search_result_list/types/pill_search_result_list';
import NotItem from '@components/common/NotItem';

const SearchResultList = ({
  searchResultData,
  isLoadingMore,
}: ISearchResultData) => {
  const { loadMorePills } = usePillSearch();
  const previousDataLength = useRef(searchResultData.length);
  const { searchItemClickHandler, keyExtractor } = usePillSearchResultList();

  useEffect(() => {
    // const isNewDataAdded = searchResultData.length > previousDataLength.current;
    // console.log('🔄 SearchResultList 리렌더링 - 데이터 개수:', searchResultData.length, isNewDataAdded ? '(데이터 추가됨)' : '');
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

  const handleLoadMore = useCallback(() => {
    loadMorePills();
  }, [loadMorePills]);

  return (
    <View style={{ flex: 1 }}>
      {searchResultData.length === 0 && !isLoadingMore ? (
        <NotItem
          mainText={'이런! 검색 결과가 없어요'}
          subText={'다른 조건으로 검색해보세요.'}
          marginTop={'0'}
        />
      ) : (
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
          removeClippedSubviews={true}
        />
      )}
    </View>
  );
};

// 깊은 비교로 불필요한 리렌더링 방지
export default memo(SearchResultList, (prevProps, nextProps) => {
  // 데이터 길이와 참조가 같으면 리렌더링하지 않음
  return prevProps.searchResultData === nextProps.searchResultData;
});
