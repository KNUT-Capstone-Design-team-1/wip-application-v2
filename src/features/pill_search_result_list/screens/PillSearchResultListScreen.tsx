import { View, Text, ActivityIndicator } from 'react-native';
import { styles } from '@features/pill_search_result_list/styles/PillSearchResultList';
import SearchResultList from '@features/pill_search_result_list/components/organisms/SearchResultList';
import { useSearchResultListStore } from '@features/pill_search_result_list/store/search_result_list_store';
import HealthKrFloatingButton from '@features/pill_search_result_list/components/atoms/HealthKrFloatingButton';
import UnifiedSearchBar from '@features/unified_search/components/UnifiedSearchBar';
import SearchConditionTags from '@features/pill_search_result_list/components/molecules/SearchConditionTags';
import { useFetchMarkImages } from '@features/pill_search_result_list/hooks/use_fetch_mark_images';

/*
TODO: 초기 검색 결과 개수가 안맞음
- list가 갱신되면 늘어남
*/

/**
 * 상단 검색바 섹션
 */
const SearchBarSection = () => (
  <View style={styles.searchBarWrapper}>
    <UnifiedSearchBar />
  </View>
);

/**
 * 검색 결과 정보 섹션 (태그 및 건수)
 */
const ResultInfoSection = ({
  count,
  markImages,
}: {
  count: number;
  markImages: { code: string; base64: string }[];
}) => (
  <>
    <SearchConditionTags markImages={markImages} />
    <Text style={styles.searchCountLabel}>검색 결과 {count}건</Text>
  </>
);

/**
 * 초기 로딩 화면
 */
const InitialLoadingView = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#007AFF" />
    <Text style={styles.loadingText}>검색 중...</Text>
  </View>
);

const PillSearchResultListScreen = () => {
  const { searchResultData, isLoading, markImages, totalDataCount } =
    useSearchResultListStore();

  // 마크 이미지 데이터 페칭 훅 사용
  useFetchMarkImages();

  const isInitialLoading = isLoading;

  return (
    <View style={styles.pillSearchResultListRoot}>
      <SearchBarSection />

      <ResultInfoSection count={totalDataCount} markImages={markImages} />

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
