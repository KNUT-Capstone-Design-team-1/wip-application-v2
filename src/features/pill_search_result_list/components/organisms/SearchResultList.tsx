import { useCallback, memo, useRef, useState, useMemo } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import SearchResultItem from '@features/pill_search_result_list/components/molecules/SearchResultItem';
import { styles } from '@features/pill_search_result_list/styles/organisms/SearchResultList';
import { usePillSearchResultList } from '@features/pill_search_result_list/hooks/use_pill_search_result_list';
import {
  ISearchResultData,
  TSearchResultListItem,
} from '@features/pill_search_result_list/types/pill_search_result_list';
import NotItem from '@components/common/NotItem';

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
  getItemType,
  isLoadingMore,
  isScrolling,
  handleScrollBegin,
  handleScrollEnd,
  onNoFillAd,
}: {
  data: TSearchResultListItem[];
  onLoadMore: () => void;
  onItemClick: (seq: string, itemImage: string) => void;
  keyExtractor: (item: TSearchResultListItem, index: number) => string;
  getItemType: (item: TSearchResultListItem) => string;
  isLoadingMore: boolean;
  isScrolling: boolean;
  handleScrollBegin: () => void;
  handleScrollEnd: () => void;
  onNoFillAd: (adId: string) => void;
}) => {
  const loadedImageSeqs = useRef(new Set<string>());

  // 뷰포트에 실제로 노출된 광고 슬롯 ID 집합 추적 (오프스크린 미노출 선요청 원천 차단)
  const [visibleAdSlotIds, setVisibleAdSlotIds] = useState<Set<string>>(
    new Set(),
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 30, // 화면에 최소 30% 이상 노출 시
  }).current;

  const handleViewableItemsChanged = useCallback(
    ({
      viewableItems,
    }: {
      viewableItems: { item: TSearchResultListItem }[];
    }) => {
      // 1. 뷰포트 내 광고 아이템 존재 여부 선행 검사
      let hasAds = false;
      for (let i = 0; i < viewableItems.length; i++) {
        if (viewableItems[i]?.item?.type === 'ads') {
          hasAds = true;
          break;
        }
      }

      // 뷰포트에 광고가 없고 이전 상태도 비어있다면 불필요한 Set 생성 및 상태 업데이트 차단
      if (!hasAds) {
        setVisibleAdSlotIds((prev) => (prev.size === 0 ? prev : new Set()));
        return;
      }

      const adKeys = new Set<string>();
      for (let i = 0; i < viewableItems.length; i++) {
        const item = viewableItems[i]?.item;
        if (item && item.type === 'ads') {
          adKeys.add(item.id);
        }
      }

      // 이전 Set과 크기 및 슬롯 ID가 동일하면 기존 참조를 유지하여 FlashList extraData 변경 및 리렌더링 차단
      setVisibleAdSlotIds((prev) => {
        if (prev.size === adKeys.size) {
          let isSame = true;
          for (const key of adKeys) {
            if (!prev.has(key)) {
              isSame = false;
              break;
            }
          }
          if (isSame) return prev;
        }
        return adKeys;
      });
    },
    [],
  );

  const handleImageLoad = useCallback((itemSeq: string) => {
    loadedImageSeqs.current.add(itemSeq);
  }, []);

  const renderItem: ListRenderItem<TSearchResultListItem> = useCallback(
    ({ item }) => {
      if (item.type === 'ads') {
        const isVisible = visibleAdSlotIds.has(item.id);
        return (
          <SearchResultItem
            type="ads"
            adId={item.id}
            isScrolling={isScrolling}
            isVisible={isVisible}
            onNoFillAd={onNoFillAd}
          />
        );
      }

      const pill = item.data;
      const isLoaded = loadedImageSeqs.current.has(pill.ITEM_SEQ);
      const shouldLoadImage = isLoaded || !isScrolling;

      return (
        <SearchResultItem
          type="item"
          resultItem={pill}
          itemClickHandler={onItemClick}
          shouldLoadImage={shouldLoadImage}
          onImageLoad={handleImageLoad}
        />
      );
    },
    [onItemClick, isScrolling, handleImageLoad, onNoFillAd, visibleAdSlotIds],
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

  const extraData = useMemo(
    () => ({ isScrolling, visibleAdSlotIds }),
    [isScrolling, visibleAdSlotIds],
  );

  return (
    <FlashList
      style={styles.searchResultListWrapper}
      contentContainerStyle={styles.searchResultListContentContainer}
      data={data}
      extraData={extraData}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemType={getItemType}
      ItemSeparatorComponent={renderSeparator}
      ListFooterComponent={renderFooter}
      showsVerticalScrollIndicator={true}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.3}
      onScrollBeginDrag={handleScrollBegin}
      onMomentumScrollBegin={handleScrollBegin}
      onScrollEndDrag={handleScrollEnd}
      onMomentumScrollEnd={handleScrollEnd}
      onViewableItemsChanged={handleViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
    />
  );
};

const SearchResultList = ({
  searchResultData,
  isLoadingMore = false,
}: ISearchResultData) => {
  const {
    displayList,
    searchItemClickHandler,
    keyExtractor,
    getItemType,
    loadMorePills,
    isScrolling,
    handleScrollBegin,
    handleScrollEnd,
    onNoFillAd,
  } = usePillSearchResultList(searchResultData);

  const isEmpty = searchResultData.length === 0 && !isLoadingMore;

  return (
    <View style={styles.searchResultListContainer}>
      {isEmpty ? (
        <EmptyResult />
      ) : (
        <ResultFlashList
          data={displayList}
          onLoadMore={loadMorePills}
          onItemClick={searchItemClickHandler}
          keyExtractor={keyExtractor}
          getItemType={getItemType}
          isLoadingMore={isLoadingMore}
          isScrolling={isScrolling}
          handleScrollBegin={handleScrollBegin}
          handleScrollEnd={handleScrollEnd}
          onNoFillAd={onNoFillAd}
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
