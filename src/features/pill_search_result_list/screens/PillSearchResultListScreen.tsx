import { View, Text, ActivityIndicator } from 'react-native';
import { styles } from '../styles/PillSearchResultList';
import SearchBar from '../components/atoms/SearchBar';
import SearchResultList from '../components/organisms/SearchResultList';
import { useSearchResultListStore } from '../store/search_result_list_store';
import HealthKrFloatingButton from '../components/atoms/HealthKrFloatingButton';

const PillSearchResultListScreen = () => {
  const { searchResultData, isLoading } = useSearchResultListStore();

  // 초기 로딩: 데이터가 없고 로딩 중일 때만 전체 화면 인디케이터 표시
  const isInitialLoading = isLoading && searchResultData.length === 0;

  return (
    <View style={styles.pillSearchResultListRoot}>
      <SearchBar />
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
