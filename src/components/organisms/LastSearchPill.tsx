import Button from "@/components/atoms/Button";
import { font, os } from "@/style/font";
import { getItem, setItem } from "@/utils/storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SvgXml } from "react-native-svg";

const LastSearchPill = () => {
  const nav: any = useNavigation();
  const [latestList, setLatestList] = useState<any[]>([]);

  const getItemList = async () => {
    const LIST = await getItem('latestSearchPill');
    let list = [];
    if (LIST) {
      list = JSON.parse(LIST);
    }
    setLatestList(list);
  }

  const handlePressItem = (data: any) => {
    nav.navigate('알약 정보', { data: data });
  }

  useFocusEffect(
    useCallback(() => {
      getItemList();
    }, [])
  );

  const styles = StyleSheet.create({
    lastSearchPillWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingTop: 18,
      paddingBottom: 18,
    },
    lastSearchPillText: {
      color: '#000',
      fontSize: font(18),
      fontFamily: os.font(500, 600),
      includeFontPadding: false,
    },
    lastSearchIcon: {
      flex: 1,
      justifyContent: 'center',
      marginTop: 3,
    },
    lastSearchPillListWrapper: {
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: 7,
      rowGap: 9,
      marginBottom: 18,
      paddingBottom: 2,
      maxHeight: 80,
      overflow: 'hidden',
    },
    lastSearchPillList: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingTop: 4,
      paddingBottom: 7,
      paddingHorizontal: 13,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: '#cdcdcd'
    },
    lastSearchPillListText: {
      color: '#000',
      fontSize: font(14),
      fontFamily: os.font(400, 500),
      includeFontPadding: false,
    },
    noListText: {
      color: '#969696',
      fontSize: font(14),
      fontFamily: os.font(400, 400),
      includeFontPadding: false,
      paddingTop: 0,
      paddingBottom: 2,
    }
  })

  const SEARCH_ICON = `
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M10.115 10.0941L13 13M11.6667 6.33333C11.6667 9.27887 9.27887 11.6667 6.33333 11.6667C3.38781 11.6667 1 9.27887 1 6.33333C1 3.38781 3.38781 1 6.33333 1C9.27887 1 11.6667 3.38781 11.6667 6.33333Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `

  return (
    <>
      <View style={styles.lastSearchPillWrapper}>
        <SvgXml xml={SEARCH_ICON} width={17} height={17} style={styles.lastSearchIcon} />
        <Text style={styles.lastSearchPillText}>
          최근 검색한 알약
        </Text>
      </View>
      <View style={styles.lastSearchPillListWrapper}>
        {latestList.length > 0 ? latestList.map((i: any, key: number) =>
          <Button.scale activeScale={0.9} key={key} onPress={() => handlePressItem(i)}>
            <View style={styles.lastSearchPillList}>
              <Text
                style={styles.lastSearchPillListText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {i.ITEM_NAME}
              </Text>
            </View>
          </Button.scale>
        ) : <Text style={styles.noListText}>최근 검색한 알약이 없습니다.</Text>
        }
      </View>
    </>
  )

}

export default LastSearchPill;