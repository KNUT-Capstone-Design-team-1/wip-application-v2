import Layout from '@/components/organisms/Layout';
import SearchResultList from '@/components/organisms/SearchResultList';
import { useGetSearchData } from '@/hooks/useGetSearchData';
import { useNavigation } from '@react-navigation/native';
import { useScreenStore } from '@/store/screen';
import { Suspense, useCallback, useEffect } from 'react';
import SkeletoneSearchResult from '@/components/organisms/SkeletoneSearchResult';

const SearchResult = (): React.JSX.Element => {
  const nav: any = useNavigation();
  const setScreen = useScreenStore((state) => state.setScreen);

  const handleSetScreen = useCallback(() => {
    setScreen('검색 결과');
  }, [setScreen]);

  useEffect(() => {
    const unsubscribe = nav.addListener('focus', handleSetScreen);
    return () => {
      unsubscribe();
    };
  }, [handleSetScreen, nav]);

  useGetSearchData();

  return (
    <Layout.default>
      <Suspense fallback={<SkeletoneSearchResult />}>
        <SearchResultList />
      </Suspense>
    </Layout.default>
  );
};

export default SearchResult;
