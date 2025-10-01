import { Suspense, useEffect, lazy, useCallback } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Layout, {
  defaultHeaderHeight,
  StatusBarHeight,
  windowHeight,
} from '@/components/organisms/Layout';
import { useScreenStore } from '@/store/screen';
import { useSearchIdStore } from '@/store/searchIdStore';
import LoadingCircle from '@/components/atoms/LoadingCircle';

const SearchIdList = lazy(() => import('@/components/organisms/SearchIdList'));

const SearchId = (): React.JSX.Element => {
  const nav: any = useNavigation();
  const setScreen = useScreenStore((state) => state.setScreen);
  const resetSearchId = useSearchIdStore((state) => state.resetSearchId);

  const handleSetScreen = useCallback(() => {
    setScreen('식별 검색');
  }, [setScreen]);

  useEffect(() => {
    nav.addListener('focus', () => handleSetScreen());
    return () => {
      resetSearchId();
      nav.removeListener('focus', () => handleSetScreen());
    };
  }, [handleSetScreen, nav, resetSearchId]);

  return (
    <Layout.default>
      <Suspense
        fallback={
          <View style={styles.viewWrapper}>
            <LoadingCircle size="large" color="#6060dd" />
          </View>
        }
      >
        <SearchIdList />
      </Suspense>
    </Layout.default>
  );
};

const styles = StyleSheet.create({
  viewWrapper: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    minHeight: windowHeight - (defaultHeaderHeight + StatusBarHeight),
    overflow: 'hidden',
    paddingBottom: 15 + (Platform.OS === 'ios' ? 28 : 0),
    paddingTop: 21,
  },
});

export default SearchId;
