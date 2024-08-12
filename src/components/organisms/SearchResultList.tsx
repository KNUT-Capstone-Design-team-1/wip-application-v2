import LoadingCircle from "@/components/atoms/LoadingCircle";
import ResultItem from "@/components/atoms/ResultItem";
import { BottomNavHeight } from "@/components/organisms/BottomNavigation";
import { StatusBarHeight, defaultHeaderHeight, windowHeight } from "@/components/organisms/Layout";
import SkeletoneSearchResult from "@/components/organisms/SkeletoneSearchResult";
import { useGetSearchData } from "@/hooks/useGetSearchData";
import { font, os } from "@/style/font";
import { FlatList, Platform, StyleSheet, Text, View } from "react-native";

const SearchResultList = (): JSX.Element => {
  const { data, isVisible, infiLoading } = useGetSearchData();

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
    skeletonList: {
      paddingTop: 50,
    },
    infiLoading: {
      position: 'absolute',
      bottom: BottomNavHeight,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      paddingVertical: 22,
      paddingBottom: 40,
      zIndex: -1,
    }
  })

  return data && isVisible ?
    <View style={styles.viewWrapper}>
      <View style={styles.noteWrapper}>
        <Text style={styles.note}>이미지에 대한 알약 검색 결과입니다.</Text>
      </View>
      <FlatList
        style={styles.resultListWrapper}
        data={data}
        renderItem={({ item, index }) =>
          <ResultItem data={item} last={(data.length - 1) === index} index={index} />
        }
        keyExtractor={item => item.ITEM_SEQ}
        //onEndReached={getResultDataByPage} // [임시제거] 페이징 기능
        onEndReachedThreshold={0.5}
      />
      {infiLoading &&
        <View style={styles.infiLoading}>
          <LoadingCircle size={'small'} />
        </View>
      }
    </View>
    :
    <SkeletoneSearchResult />
};

export default SearchResultList;