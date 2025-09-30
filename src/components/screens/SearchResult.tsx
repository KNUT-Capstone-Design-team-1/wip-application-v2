import Layout from '@/components/organisms/Layout';
import SearchResultList from '@/components/organisms/SearchResultList';
// import { useGetSearchData } from '@/hooks/useGetSearchData';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useScreenStore } from '@/store/screen';
import { Suspense, useCallback, useEffect, use, useRef } from 'react';
import SkeletoneSearchResult from '@/components/organisms/SkeletoneSearchResult';
import { useSearchQueryStore } from '@/store/searchQueryStore';
import { useSearchImgStore } from '@/store/searchImgStore';
import { postImageServer } from '@/api/server';
import { TPillSearchParam } from '@/api/db/query';
import { handleError } from '@/utils/error';
import Toast from 'react-native-toast-message';
import { ErrorBoundary } from 'react-error-boundary';

type TResImageData = {
  PRINT: string[];
  SHAPE: string[];
  COLOR: string[];
  FORM_CODE: string[];
  DIVIDING: string[];
};

interface ITResImageData {
  res: TResImageData;
  status: number;
  message: string;
}

const SearchErrorHandler = ({ error }: { error: Error }) => {
  const nav: any = useNavigation();

  useEffect(() => {
    const text = handleError(error);

    nav.goBack();
    Toast.show({
      type: 'errorToast',
      text1: `알약검색에 실패했습니다.${text}`,
    });
  }, [error, nav]);

  return null;
};

const SearchDataHandler = () => {
  const route: any = useRoute();
  const nav: any = useNavigation();
  const mode = route.params.mode ?? 0;
  const initData = route.params.data;

  const setSearchData = useSearchQueryStore((state) => state.setSearchQuery);
  const resetSearchData = useSearchQueryStore(
    (state) => state.resetSearchQuery,
  );
  const imageBase64 = useSearchImgStore((state) => state.searchImgBase64);
  const resetSearchImage = useSearchImgStore((state) => state.resetSearchImg);

  const imgSearchPromiseRef = useRef<Promise<ITResImageData> | null>(null);

  if (!imgSearchPromiseRef.current && imageBase64 && mode !== 0) {
    imgSearchPromiseRef.current = postImageServer(
      imageBase64,
    ) as Promise<ITResImageData>;
  }

  useEffect(() => {
    return () => {
      resetSearchData();
      resetSearchImage();
    };
  }, [resetSearchData, resetSearchImage]);

  const promiseResult = imgSearchPromiseRef.current
    ? use(imgSearchPromiseRef.current)
    : null;

  useEffect(() => {
    if (promiseResult) {
      const { res, status, message } = promiseResult;

      if (status !== 200) {
        nav.goBack();
        Toast.show({
          type: 'errorToast',
          text1: message ?? '알약검색에 실패했습니다. (Unknown)',
        });
        return;
      }

      const isEmpty =
        res.PRINT.length === 0 &&
        res.SHAPE.length === 0 &&
        res.COLOR.length === 0;

      if (isEmpty) {
        nav.goBack();
        Toast.show({
          type: 'errorToast',
          text1: '검색된 알약 정보가 없습니다.',
        });
        return;
      }

      const data: TPillSearchParam = {
        PRINT_FRONT: '',
        PRINT_BACK: '',
        DRUG_SHAPE: res.SHAPE,
        COLOR_CLASS1: res.COLOR,
        COLOR_CLASS2: res.COLOR,
        FORM_CODE: res.FORM_CODE,
        DIVIDING: res.DIVIDING,
        MARK: '',
        ITEM_NAME: '',
        ENTP_NAME: '',
        LINE_FRONT: [],
        LINE_BACK: [],
        MARK_CODE_FRONT: '',
        MARK_CODE_BACK: '',
      };

      setSearchData({ data, mode });
    } else if (initData && mode === 0) {
      setSearchData({ data: initData, mode });
    }
  }, [promiseResult, initData, mode, nav]);

  return <SearchResultList />;
};

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

  // useGetSearchData();

  return (
    <Layout.default>
      <ErrorBoundary FallbackComponent={SearchErrorHandler}>
        <Suspense fallback={<SkeletoneSearchResult />}>
          <SearchDataHandler />
        </Suspense>
      </ErrorBoundary>
    </Layout.default>
  );
};

export default SearchResult;
