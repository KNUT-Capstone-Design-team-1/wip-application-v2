import { View, Text, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import { styles } from '../styles/PillSearchResultList';
import SearchResultList from '../components/organisms/SearchResultList';
import { useSearchResultListStore } from '../store/search_result_list_store';
import HealthKrFloatingButton from '../components/atoms/HealthKrFloatingButton';
import UnifiedSearchBar from '@features/unified_search/components/UnifiedSearchBar';
import SearchConditionTags from '../components/molecules/SearchConditionTags';
import { getMarkImages } from '@services/database/queries/mark_images';

const PillSearchResultListScreen = () => {
  const {
    searchResultData,
    isLoading,
    searchParam,
    markImages,
    setMarkImages,
  } = useSearchResultListStore();

  useEffect(() => {
    const fetchMarkImages = async () => {
      const marks = [
        searchParam?.MARK_CODE_FRONT,
        searchParam?.MARK_CODE_BACK,
      ].filter(Boolean) as string[];

      if (marks.length > 0) {
        try {
          // 비동기로 마크 이미지 정보를 가져와서 스토어에 저장
          const results = await Promise.all(
            marks.map((code) => getMarkImages({ code }, { page: 1, limit: 1 })),
          );
          const images = results
            .flat()
            .map((r) => ({ code: r.code, base64: r.base64 }));
          setMarkImages(images);
        } catch (error) {
          console.error('마크 이미지 로드 실패:', error);
        }
      } else {
        setMarkImages([]);
      }
    };

    fetchMarkImages();
  }, [
    searchParam?.MARK_CODE_FRONT,
    searchParam?.MARK_CODE_BACK,
    setMarkImages,
  ]);

  // 초기 로딩: 데이터가 없고 로딩 중일 때만 전체 화면 인디케이터 표시
  const isInitialLoading = isLoading && searchResultData.length === 0;

  return (
    <View style={styles.pillSearchResultListRoot}>
      <View
        style={{
          marginTop: 15,
          marginBottom: 10,
          backgroundColor: '#fff',
          zIndex: 10,
        }}
      >
        <UnifiedSearchBar />
      </View>

      <SearchConditionTags markImages={markImages} />

      <Text style={styles.searchCountLabel}>
        검색 결과 {searchResultData.length}건
      </Text>

      {isInitialLoading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
          }}
        >
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={{ marginTop: 16, fontSize: 16, color: '#666' }}>
            검색 중...
          </Text>
        </View>
      ) : (
        // 추가 로딩 중에도 SearchResultList를 언마운트하지 않음 (스크롤 유지)
        <SearchResultList
          searchResultData={searchResultData}
          isLoadingMore={isLoading}
        />
      )}

      {/* 약학정보원 검색 플로팅 버튼 */}
      {!isInitialLoading && <HealthKrFloatingButton />}
    </View>
  );
};

export default PillSearchResultListScreen;
