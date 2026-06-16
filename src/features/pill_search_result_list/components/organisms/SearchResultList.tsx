import { useCallback, memo } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import SearchResultItem from '@features/pill_search_result_list/components/molecules/SearchResultItem';
import { styles } from '@features/pill_search_result_list/styles/organisms/SearchResultList';
import { usePillSearchResultList } from '@features/pill_search_result_list/hooks/use_pill_search_result_list';
import { ISearchResultData } from '@features/pill_search_result_list/types/pill_search_result_list';
import NotItem from '@components/common/NotItem';
import { IPillData } from '@services/database/types';
import { px } from '@utils/responsive';

/**
 * 검색 결과가 없을 때 표시할 컴포넌트
 */
const EmptyResult = () => (
  <NotItem
    mainText={'이런! 검색 결과가 없어요'}
    subText={'다른 조건으로 검색해보세요.'}
    marginTop={'0'}
  />
);

/**
 * 알약 리스트를 렌더링하는 FlashList 컴포넌트
 */
const ResultFlashList = ({
  data,
  onLoadMore,
  onItemClick,
  keyExtractor,
  isLoadingMore,
}: {
  data: IPillData[];
  onLoadMore: () => void;
  onItemClick: (seq: string, itemImage: string) => void;
  keyExtractor: (item: IPillData, index: number) => string;
  isLoadingMore: boolean;
}) => {
  const renderItem: ListRenderItem<IPillData> = useCallback(
    ({ item, index }) => (
      <View style={index === 0 ? { marginTop: px(-10) } : undefined}>
        <SearchResultItem resultItem={item} itemClickHandler={onItemClick} />
      </View>
    ),
    [onItemClick],
  );

  const renderSeparator = useCallback(() => <View style={styles.hr} />, []);

  const renderFooter = useCallback(() => {
    return isLoadingMore ? (
      <View style={{ paddingVertical: px(20), height: px(100) }}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    ) : (
      <View style={{ height: px(100) }} />
    );
  }, [isLoadingMore]);

  return (
    <FlashList
      style={styles.searchResultListWrapper}
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ItemSeparatorComponent={renderSeparator}
      ListFooterComponent={renderFooter}
      showsVerticalScrollIndicator={true}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.3}
    />
  );
};

const SearchResultList = ({
  searchResultData,
  isLoadingMore = false,
}: ISearchResultData) => {
  const { searchItemClickHandler, keyExtractor, loadMorePills } =
    usePillSearchResultList();

  const isEmpty = searchResultData.length === 0 && !isLoadingMore;

  return (
    <View style={{ flex: 1 }}>
      {isEmpty ? (
        <EmptyResult />
      ) : (
        <ResultFlashList
          data={searchResultData}
          onLoadMore={loadMorePills}
          onItemClick={searchItemClickHandler}
          keyExtractor={keyExtractor}
          isLoadingMore={isLoadingMore}
        />
      )}
    </View>
  );
};

export default memo(SearchResultList, (prevProps, nextProps) => {
  return (
    prevProps.searchResultData === nextProps.searchResultData &&
    prevProps.isLoadingMore === nextProps.isLoadingMore
  );
});
