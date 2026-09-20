import { useCallback, memo, useState, useRef, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import SearchResultItem from '@features/pill_search_result_list/components/molecules/SearchResultItem';
import { styles } from '@features/pill_search_result_list/styles/organisms/SearchResultList';
import { usePillSearchResultList } from '@features/pill_search_result_list/hooks/use_pill_search_result_list';
import { ISearchResultData } from '@features/pill_search_result_list/types/pill_search_result_list';
import NotItem from '@components/common/NotItem';
import { IPillData } from '@services/database/types';

// TODO: 다음 페이지 로드 중 에러 발생 시 재로드 대응 필요 (트리거 방식 또는 재실행)

// 검색 결과가 없을 때 표시할 컴포넌트
const EmptyResult = () => (
  <NotItem
    mainText={'이런! 검색 결과가 없어요'}
    subText={'다른 조건으로 검색해보세요.'}
    marginTop={'0'}
  />
);

// 알약 리스트를 렌더링하는 FlashList 컴포넌트
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
  const isScrollingRef = useRef(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadedImageSeqs = useRef(new Set<string>());

  useEffect(() => {
    return () => {
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);

  const handleScrollBegin = useCallback(() => {
    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = null;
    }
    if (!isScrollingRef.current) {
      isScrollingRef.current = true;
      setIsScrolling(true);
    }
  }, []);

  const handleScrollEnd = useCallback(() => {
    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
    }
    scrollTimerRef.current = setTimeout(() => {
      isScrollingRef.current = false;
      setIsScrolling(false);
    }, 100);
  }, []);

  const handleImageLoad = useCallback((itemSeq: string) => {
    loadedImageSeqs.current.add(itemSeq);
  }, []);

  const renderItem: ListRenderItem<IPillData> = useCallback(
    ({ item }) => {
      const isLoaded = loadedImageSeqs.current.has(item.ITEM_SEQ);
      const shouldLoadImage = isLoaded || !isScrolling;

      return (
        <SearchResultItem
          resultItem={item}
          itemClickHandler={onItemClick}
          shouldLoadImage={shouldLoadImage}
          onImageLoad={handleImageLoad}
        />
      );
    },
    [onItemClick, isScrolling, handleImageLoad],
  );

  const renderSeparator = useCallback(() => <View style={styles.hr} />, []);

  const renderFooter = useCallback(() => {
    return isLoadingMore ? (
      <View style={styles.searchResultListLoadingWrapper}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    ) : (
      <View style={styles.bottomSpacer} />
    );
  }, [isLoadingMore]);

  return (
    <FlashList
      style={styles.searchResultListWrapper}
      contentContainerStyle={styles.searchResultListContentContainer}
      data={data}
      extraData={isScrolling}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ItemSeparatorComponent={renderSeparator}
      ListFooterComponent={renderFooter}
      showsVerticalScrollIndicator={true}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.3}
      onScrollBeginDrag={handleScrollBegin}
      onMomentumScrollBegin={handleScrollBegin}
      onScrollEndDrag={handleScrollEnd}
      onMomentumScrollEnd={handleScrollEnd}
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
    <View style={styles.searchResultListContainer}>
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
