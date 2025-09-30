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

//TODO: flatlist 메모리 최적화 필요
const SearchResultList = (): React.JSX.Element => {
  const { paginatedData, totalSize, loadData } = useGetPillData(20);

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
