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
import SkeletoneSearchResult from '@/components/organisms/SkeletoneSearchResult';

//TODO: flatlist 메모리 최적화 필요
const SearchResultList = (): JSX.Element => {
  const { paginatedData, totalSize, loadData, isLoading } = useGetPillData(20);

  return (
    <>
      {isLoading ? (
        <SkeletoneSearchResult />
      ) : (
        <View style={styles.viewWrapper}>
          <View style={styles.noteWrapper}>
            <Text style={styles.note}>총 {totalSize}개의 검색 결과입니다.</Text>
          </View>
          <FlashList
            data={paginatedData}
            renderItem={({ item }) => <ResultItem data={item} />}
            estimatedItemSize={135}
            keyExtractor={(item) => item.ITEM_SEQ}
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
      )}
    </>
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
