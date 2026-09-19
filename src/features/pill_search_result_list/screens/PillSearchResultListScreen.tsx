import { View, ActivityIndicator } from 'react-native';
import { useCallback } from 'react';
import { BaseText } from '@components/common/BaseText';
import { styles } from '@features/pill_search_result_list/styles/PillSearchResultList';
import SearchResultList from '@features/pill_search_result_list/components/organisms/SearchResultList';
import { useSearchResultListStore } from '@features/pill_search_result_list/store/search_result_list_store';
import HealthKrFloatingButton from '@features/pill_search_result_list/components/atoms/HealthKrFloatingButton';
import SearchConditionTags from '@features/pill_search_result_list/components/molecules/SearchConditionTags';
import { useFetchMarkImages } from '@features/pill_search_result_list/hooks/use_fetch_mark_images';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLOR } from '@constants/color';
import { useRouter } from 'expo-router';
import { useSyncSearchIdStore } from '@features/pill_search_result_list/hooks/useSyncSearchIdStore';

//  검색 결과 정보 섹션 (태그 및 건수)
const ResultInfoSection = ({
  count,
  hasMore,
  isUnifiedSearch,
  markImages,
  onTagPress,
}: {
  count: number;
  hasMore: boolean;
  isUnifiedSearch: boolean;
  markImages: { code: string; base64: string }[];
  onTagPress: () => void;
}) => {
  const countText =
    isUnifiedSearch && hasMore
      ? `검색 결과 ${count}건 이상`
      : `검색 결과 ${count}건`;

  return (
    <View style={styles.searchResultInfoWrapper}>
      <SearchConditionTags markImages={markImages} onPress={onTagPress} />
      <BaseText style={styles.searchCountLabel} weight="medium" size={12}>
        {countText}
      </BaseText>
    </View>
  );
};

//  초기 로딩 화면
const InitialLoadingView = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={COLOR['primary']} />
    <BaseText style={styles.loadingText} weight="semiBold" size={16}>
      검색 중...
    </BaseText>
  </View>
);

const PillSearchResultListScreen = () => {
  const insets = useSafeAreaInsets();
  const {
    searchResultData,
    isLoading,
    markImages,
    totalDataCount,
    searchParam,
    hasMore,
  } = useSearchResultListStore();

  const { syncToSearchIdStore } = useSyncSearchIdStore();
  const router = useRouter();

  // 마크 이미지 데이터 페칭 훅 사용
  useFetchMarkImages();

  const handleTagPress = useCallback(() => {
    /**
     * 통합검색(KEYWORD 파라미터 사용)인 경우 식별검색 폼으로 이동하지 않음
     * TODO: 나중에 통합검색 필터나 전용 화면이 추가되면 해당 화면으로 라우팅되도록 작업 필요
     */
    if (searchParam?.KEYWORD) {
      return;
    }

    syncToSearchIdStore();
    router.navigate('/pill-identification-search'); // 식별 검색 화면으로 이동 (navigate로 중복 스택 방지)
  }, [syncToSearchIdStore, router, searchParam]);

  const isInitialLoading = isLoading && searchResultData.length === 0;
  const isUnifiedSearch = Boolean(searchParam?.KEYWORD);

  return (
    <View
      style={[
        styles.pillSearchResultListRoot,
        { paddingBottom: insets.bottom },
      ]}
    >
      <ResultInfoSection
        count={totalDataCount}
        hasMore={hasMore}
        isUnifiedSearch={isUnifiedSearch}
        markImages={markImages}
        onTagPress={handleTagPress}
      />

      {isInitialLoading ? (
        <InitialLoadingView />
      ) : (
        <SearchResultList
          searchResultData={searchResultData}
          isLoadingMore={isLoading}
        />
      )}

      {!isInitialLoading && <HealthKrFloatingButton />}
    </View>
  );
};

export default PillSearchResultListScreen;
