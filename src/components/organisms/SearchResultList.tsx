import ResultItem from "@/components/atoms/ResultItem";
import { StatusBarHeight, defaultHeaderHeight, windowHeight } from "@/components/organisms/Layout";
import { font, os } from "@/style/font";
import { FlatList, Platform, StyleSheet, Text, View } from "react-native";
import { usePagination } from "@/hooks/usePagination";

//TODO: flatlist 메모리 최적화 필요
const SearchResultList = ({ filter, params }: { filter: string, params: any }): JSX.Element => {
  const { paginatedData, totalSize, loadData } = usePagination(filter, params, 20)

  const styles = StyleSheet.create({
    resultListWrapper: {
      paddingTop: 50,
    },
    viewWrapper: {
      minHeight: windowHeight - (defaultHeaderHeight + StatusBarHeight),
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      overflow: 'hidden',
      paddingBottom: 15 + (Platform.OS === 'ios' ? 28 : 0),
      backgroundColor: '#ffffff',
    },
    noteWrapper: {
      position: 'absolute',
      flexDirection: 'row',
      justifyContent: 'center',
      width: '100%',
      alignItems: 'center',
      paddingTop: 20,
      paddingBottom: 12,
      backgroundColor: '#fff',
      zIndex: 10,
    },
    note: {
      color: '#000',
      textAlign: 'center',
      fontSize: font(15),
      fontFamily: os.font(500, 500),
      includeFontPadding: false,
      paddingBottom: 0,
    },
  })

  return (
    <View style={styles.viewWrapper}>
      <View style={styles.noteWrapper}>
        <Text style={styles.note}>총 {totalSize}개의 검색 결과입니다.</Text>
      </View>
      <FlatList
        style={styles.resultListWrapper}
        data={paginatedData}
        renderItem={({ item, index }) =>
          <ResultItem data={item} last={(paginatedData.length - 1) === index} index={index} />
        }
        keyExtractor={item => item.ITEM_SEQ}
        onEndReached={loadData}
        onEndReachedThreshold={0.5}
      />
    </View>)
};

export default SearchResultList;