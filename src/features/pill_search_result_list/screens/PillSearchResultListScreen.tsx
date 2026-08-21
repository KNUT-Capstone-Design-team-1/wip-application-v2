import { View, ActivityIndicator } from 'react-native';
import { useState, useCallback } from 'react';
import { BaseText } from '@components/common/BaseText';
import { styles } from '@features/pill_search_result_list/styles/PillSearchResultList';
import SearchResultList from '@features/pill_search_result_list/components/organisms/SearchResultList';
import { useSearchResultListStore } from '@features/pill_search_result_list/store/search_result_list_store';
import HealthKrFloatingButton from '@features/pill_search_result_list/components/atoms/HealthKrFloatingButton';
import UnifiedSearchBar from '@features/unified_search/components/UnifiedSearchBar';
import SearchConditionTags from '@features/pill_search_result_list/components/molecules/SearchConditionTags';
import { useFetchMarkImages } from '@features/pill_search_result_list/hooks/use_fetch_mark_images';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLOR } from '@constants/color';
import PillIdentificationSearchModal from '@features/pill_identification_search/components/organisms/PillIdentificationSearchModal';
import { useSyncSearchIdStore } from '@features/pill_search_result_list/hooks/useSyncSearchIdStore';

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
  onTagPress,
}: {
  count: number;
  markImages: { code: string; base64: string }[];
  onTagPress: () => void;
}) => (
  <View style={styles.searchResultInfoWrapper}>
    <SearchConditionTags markImages={markImages} onPress={onTagPress} />
    <BaseText style={styles.searchCountLabel} weight="medium" size={12}>
      검색 결과 {count}건
    </BaseText>
  </View>
);

/**
 * 초기 로딩 화면
 */
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
  const { searchResultData, isLoading, markImages, totalDataCount } =
    useSearchResultListStore();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const { syncToSearchIdStore } = useSyncSearchIdStore();

  // 마크 이미지 데이터 페칭 훅 사용
  useFetchMarkImages();

  const handleTagPress = useCallback(() => {
    syncToSearchIdStore();
    setIsModalVisible(true);
  }, [syncToSearchIdStore]);

  const isInitialLoading = isLoading && searchResultData.length === 0;

  return (
    <View
      style={[
        styles.pillSearchResultListRoot,
        { paddingBottom: insets.bottom },
      ]}
    >
      <SearchBarSection />

      <ResultInfoSection
        count={totalDataCount}
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

      <PillIdentificationSearchModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </View>
  );
};

export default PillSearchResultListScreen;
