import { Platform, StyleSheet, Text, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import {
  StatusBarHeight,
  defaultHeaderHeight,
  windowHeight,
} from '@/components/organisms/Layout';
import { font, os } from '@/style/font';
import ResultItem from '@/components/atoms/ResultItem';
import { useGetPillData } from '@/hooks/useGetPillData';
import { useCallback } from 'react';
import { TPillData } from '@/api/db/models/pillData';
import { useSearchIdStore } from '@/store/searchIdStore';
import Button from '@components/atoms/Button';
import { useNavigation } from '@react-navigation/native';
import TagWrapper from '@components/molecules/TagWrapper';
import { searchResultTagData } from '@utils/tag';

//TODO: flatlist 메모리 최적화 필요
const SearchResultList = (): React.JSX.Element => {
  const { paginatedData, totalSize, loadData } = useGetPillData(20);
  const { getSearchIdItems } = useSearchIdStore();
  const nav = useNavigation<any>();
  const searchItems = searchResultTagData(Object.entries(getSearchIdItems()));

  // keyExtractor를 useCallback으로 메모이제이션
  const keyExtractor = useCallback((item: TPillData) => item.ITEM_SEQ, []);

  // renderItem을 useCallback으로 메모이제이션
  const renderItem = useCallback(
    ({ item }: { item: TPillData }) => <ResultItem data={item} />,
    [],
  );

  // getItemType으로 아이템 타입 지정 (FlashList 재활용 최적화)
  const getItemType = useCallback(() => 'pill-item', []);

  return (
    <View style={styles.viewWrapper}>
      <View style={styles.noteWrapper}>
        <Text style={styles.note}>총 {totalSize}개의 검색 결과입니다.</Text>
      </View>
      {/* 재검색 버튼 */}
      <View style={styles.searchedFilterWrapper}>
        <TagWrapper tagList={searchItems} wrapperWidth={'80%'} />
        <Button.scale
          onPress={() => {
            nav.navigate('알약 식별 검색');
          }}
        >
          <View style={styles.reSearch}>
            {/* loading svg로 변경해서 넣기 */}
            {/*<SearchSvg width={14} height={14} color={'#fff'} />*/}
            <Text style={styles.buttonText}>재검색</Text>
          </View>
        </Button.scale>
      </View>
      <FlashList
        data={paginatedData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemType={getItemType}
        onEndReached={loadData}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={() => (
          <View style={styles.emptyViewWrapper}>
            <Text style={styles.note}>검색 결과가 없습니다</Text>
          </View>
        )}
        ListFooterComponent={() => <View style={{ marginBottom: 200 }} />}
        contentContainerStyle={styles.resultListWrapper}
        removeClippedSubviews={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  emptyViewWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  note: {
    color: '#000',
    fontFamily: os.font(500, 500),
    fontSize: font(15),
    includeFontPadding: false,
    paddingBottom: 0,
    textAlign: 'center',
  },
  noteWrapper: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 12,
    paddingTop: 20,
    position: 'absolute',
    width: '100%',
    zIndex: 10,
  },
  searchedFilterWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    zIndex: 10,
    marginTop: 60,
    marginBottom: -30,
    margin: 'auto',
    overflow: 'scroll',
  },
  reSearch: {
    color: '#fff',
    backgroundColor: '#4c4ae8',
    borderRadius: 10,
    width: 60,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
  },
  resultListWrapper: { paddingTop: 50 },
  viewWrapper: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    minHeight: windowHeight - (defaultHeaderHeight + StatusBarHeight),
    overflow: 'hidden',
    paddingBottom: 15 + (Platform.OS === 'ios' ? 28 : 0),
  },
});

export default SearchResultList;
