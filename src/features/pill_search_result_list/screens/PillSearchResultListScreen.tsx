import { View, Text, ActivityIndicator } from 'react-native';
import { styles } from '../styles/PillSearchResultList';
import SearchBar from '../components/atoms/SearchBar';
import SearchResultList from '../components/organisms/SearchResultList';
import { useSearchResultListStore } from '../store/search_result_list_store';

const PillSearchResultListScreen = () => {
  const { getSearchResultData, isLoading } = useSearchResultListStore();

  return (
    <View style={styles.pillSearchResultListRoot}>
      <SearchBar />
      <Text style={styles.searchCountLabel}>
        검색 결과 {getSearchResultData().length}건
      </Text>

      {isLoading ? (
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
        <SearchResultList searchResultData={getSearchResultData()} />
      )}
    </View>
  );
};

export default PillSearchResultListScreen;
