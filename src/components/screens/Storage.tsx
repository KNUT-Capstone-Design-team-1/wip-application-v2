import StorageItem from '@/components/atoms/StorageItem';
import Layout, {
  StatusBarHeight,
  defaultHeaderHeight,
  windowHeight,
} from '@/components/organisms/Layout';
import { usePillBox } from '@/hooks/usePillBox';
import { useNavigation } from '@react-navigation/native';
import { useScreenStore } from '@/store/screen';
import { font, os } from '@/style/font';
import { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Platform, Text } from 'react-native';
import { PillBox } from '@/api/db/models/pillBox';

const Storage = (): React.JSX.Element => {
  const nav: any = useNavigation();
  const setScreen = useScreenStore((state) => state.setScreen);

  const { getPillList } = usePillBox();
  const [data, setData] = useState<any[]>([]);

  const handleSetScreen = useCallback(() => {
    setScreen('보관함');
  }, [setScreen]);

  const getStorage = useCallback(() => {
    setData(getPillList());
  }, [getPillList]);

  useEffect(() => {
    const unsubscribe = nav.addListener('focus', () => {
      handleSetScreen();
      getStorage();
    });
    return () => {
      unsubscribe();
    };
  }, [handleSetScreen, nav, getStorage]);

  const styles = StyleSheet.create({
    noList: {
      alignItems: 'center',
      height: 200,
      justifyContent: 'center',
      width: '100%',
    },
    noListText: {
      color: '#000',
      fontFamily: os.font(500, 500),
      fontSize: font(18),
      includeFontPadding: false,
      paddingBottom: 0,
    },
    numberText: {
      color: '#444',
      fontFamily: os.font(500, 500),
      fontSize: font(14),
      includeFontPadding: false,
      paddingBottom: 0,
    },
    pillList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      position: 'relative',
    },
    scrollViewWrapper: {
      backgroundColor: '#fff',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      flex: 1,
    },
    title: {
      color: '#000',
      fontFamily: os.font(700, 700),
      fontSize: font(24),
      includeFontPadding: false,
      paddingBottom: 0,
    },
    titleWrapper: {
      alignItems: 'flex-end',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 8,
      paddingVertical: 16,
    },
    viewWrapper: {
      backgroundColor: '#ffffff',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      minHeight: windowHeight - (defaultHeaderHeight + StatusBarHeight),
      paddingBottom: 15 + (Platform.OS === 'ios' ? 28 : 0),
      paddingHorizontal: 15,
    },
  });

  return (
    <Layout.default>
      <ScrollView style={styles.viewWrapper}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>알약</Text>
          <Text style={styles.numberText}>{data.length}개 보관됨</Text>
        </View>
        {data.length > 0 ? (
          <View style={styles.pillList}>
            {data.map((i: PillBox) => (
              <StorageItem key={i.ITEM_SEQ} data={i} refresh={getStorage} />
            ))}
          </View>
        ) : (
          <View style={styles.noList}>
            <Text style={styles.noListText}>보관된 알약이 없습니다.</Text>
          </View>
        )}
      </ScrollView>
    </Layout.default>
  );
};

export default Storage;
