import Button from '@/components/atoms/Button';
import { font, os } from '@/style/font';
import { getItem } from '@/utils/storage';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

const LastSearchPill = () => {
  const nav: any = useNavigation();
  const [latestList, setLatestList] = useState<any[]>([]);

  const getItemList = useCallback(async () => {
    const LIST = await getItem('latestSearchPill');
    let list = [];
    if (LIST) {
      list = JSON.parse(LIST);
    }
    setLatestList(list);
  }, []);

  const handlePressItem = (data: any) => {
    nav.navigate('알약 정보', { data: data });
  };

  useEffect(() => {
    const unsubscribe = nav.addListener('focus', () => {
      getItemList();
    });
    return () => {
      unsubscribe();
    };
  }, [getItemList]);

  const SEARCH_ICON = `
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M10.115 10.0941L13 13M11.6667 6.33333C11.6667 9.27887 9.27887 11.6667 6.33333 11.6667C3.38781 11.6667 1 9.27887 1 6.33333C1 3.38781 3.38781 1 6.33333 1C9.27887 1 11.6667 3.38781 11.6667 6.33333Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `;

  return (
    <>
      <View style={styles.lastSearchPillWrapper}>
        <SvgXml
          xml={SEARCH_ICON}
          width={17}
          height={17}
          style={styles.lastSearchIcon}
        />
        <Text style={styles.lastSearchPillText}>최근 검색한 알약</Text>
      </View>
      <View style={styles.lastSearchPillListWrapper}>
        {latestList.length > 0 ? (
          latestList.map((i: any, key: number) => (
            <Button.scale
              activeScale={0.9}
              key={key}
              onPress={() => handlePressItem(i)}
            >
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
          ))
        ) : (
          <View style={styles.noListWrapper}>
            <Text style={styles.noListText}>최근 검색한 알약이 없습니다.</Text>
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  lastSearchIcon: { flex: 1, justifyContent: 'center', marginTop: 3 },
  lastSearchPillList: {
    borderColor: '#cdcdcd',
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 7,
    paddingHorizontal: 13,
    paddingTop: 4,
  },
  lastSearchPillListText: {
    color: '#000',
    fontFamily: os.font(400, 500),
    fontSize: font(14),
    includeFontPadding: false,
  },
  lastSearchPillListWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    height: 80,
    justifyContent: 'center',
    marginBottom: 18,
    overflow: 'hidden',
    paddingBottom: 2,
    rowGap: 9,
  },
  lastSearchPillText: {
    color: '#000',
    fontFamily: os.font(500, 600),
    fontSize: font(18),
    includeFontPadding: false,
  },
  lastSearchPillWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingBottom: 8,
    paddingTop: 18,
  },
  noListText: {
    color: '#444',
    fontFamily: os.font(400, 400),
    fontSize: font(14),
    includeFontPadding: false,
    paddingBottom: 2,
    paddingTop: 0,
  },
  noListWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
});

export default LastSearchPill;
