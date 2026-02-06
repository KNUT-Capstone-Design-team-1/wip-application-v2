import { useEffect } from 'react';
import { View, FlatList } from 'react-native';
import SearchResultItem from '../molecules/SearchResultItem';
import { styles } from '../../styles/organisms/SearchResultList';

interface ISearchResultData {
  searchResultData: any[];
}

const SearchResultList = ({ searchResultData }: ISearchResultData) => {
  useEffect(() => {
    console.log('검색 결과 개수:', searchResultData.length);
    if (searchResultData.length > 0) {
      console.log('첫 번째 결과:', searchResultData[0]);
    }
  }, [searchResultData]);

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <View style={index === 0 ? { marginTop: -10 } : undefined}>
      <SearchResultItem resultItem={item} />
    </View>
  );

  const renderSeparator = () => <View style={styles.hr} />;

  const handleLoadMore = () => {
    console.log('다음 페이지 로드 요청');
  };

  return (
    <FlatList
      style={styles.searchResultListWrapper}
      data={searchResultData}
      renderItem={renderItem}
      keyExtractor={(item, index) => item.ITEM_SEQ || `item-${index}`}
      ItemSeparatorComponent={renderSeparator}
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={true}
      // 무한 스크롤 설정
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5} // 50% 지점에서 로드
      // onEndReached가 너무 빨리 호출되는 것 방지
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
    />
  );
};

export default SearchResultList;
