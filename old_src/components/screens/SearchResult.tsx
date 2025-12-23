import Layout from '@/components/organisms/Layout';
import SearchResultList from '@/components/organisms/SearchResultList';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useScreenStore } from '@/store/screen';
import { useCallback, useEffect, useRef, useMemo, useState } from 'react';
import SkeletoneSearchResult from '@/components/organisms/SkeletoneSearchResult';
import { useSearchQueryStore } from '@/store/searchQueryStore';
import { useSearchImgStore } from '@/store/searchImgStore';
import { postImageServer } from '@/api/server';
import { TPillSearchParam } from '@/api/db/query';
import { handleError } from '@/utils/error';
import Toast from 'react-native-toast-message';
import { ErrorBoundary } from 'react-error-boundary';
import { convertToCacheKey } from '@/utils/converter';
import axios from 'axios';

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

// Promise 요청 전역 캐시
const searchPromiseCache = new Map<
  string,
  {
    promise: Promise<ITResImageData>;
    controller: AbortController;
  }
>();

// 이미지 검색 Promise 캐시 반환 함수
const getSearchPromise = (base64: string) => {
  const key = convertToCacheKey(base64);

  if (!searchPromiseCache.has(key)) {
    const controller = new AbortController();

    const promise = postImageServer(base64, {
      signal: controller.signal,
    }) as Promise<ITResImageData>;

    searchPromiseCache.set(key, { promise, controller });
  }
  return searchPromiseCache.get(key)!;
};

// 검색 에러 핸들러
const SearchErrorHandler = ({ error }: { error: Error }) => {
  const nav: any = useNavigation();

  useEffect(() => {
    const text = handleError(error);

    nav.goBack();
    Toast.show({
      type: 'errorToast',
      text1: text,
    });
  }, [error, nav]);

  return null;
};

// 검색 데이터 핸들러
const SearchDataHandler = () => {
  const route: any = useRoute();
  const nav: any = useNavigation();
  const mode = route.params.mode ?? 0;
  const initData = route.params.data;

  const [isLoading, setIsLoading] = useState(true);

  const setSearchData = useSearchQueryStore((state) => state.setSearchQuery);
  const imageBase64 = useSearchImgStore((state) => state.searchImgBase64);

  const [serverData, setServerData] = useState<ITResImageData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cacheKeyRef = useRef<string>('');
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    if (mode === 0 || !imageBase64) {
      setIsLoading(false);
      return;
    }

    const cacheKey = convertToCacheKey(imageBase64);
    cacheKeyRef.current = cacheKey;

    const { promise } = getSearchPromise(imageBase64);

    promise
      .then((data) => {
        if (isMountedRef.current && cacheKeyRef.current === cacheKey) {
          setServerData(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (
          axios.isCancel(err) ||
          err.name === 'AbortError' ||
          err.code === 'ERR_CANCELED'
        ) {
          return;
        }

        if (isMountedRef.current && cacheKeyRef.current === cacheKey) {
          setError(handleError(err));
          setIsLoading(false);
        }
      });

    return () => {
      isMountedRef.current = false;
      const cached = searchPromiseCache.get(cacheKey);
      if (cached) {
        cached.controller.abort();
        searchPromiseCache.delete(cacheKey);
      }
    };
  }, [imageBase64, mode]);

  const resultData = useMemo(() => {
    if (error) {
      return { type: 'error', message: error };
    }

    if (mode === 0) return { type: 'success', data: initData };
    if (!serverData) return null;

    const { res, status, message } = serverData;

    if (status !== 200) {
      return {
        type: 'error',
        message: message ?? '알약검색에 실패했습니다. (Unknown)',
      };
    }

    const isEmpty =
      res.PRINT.length === 0 &&
      res.SHAPE.length === 0 &&
      res.COLOR.length === 0;

    if (isEmpty) {
      return { type: 'error', message: '검색된 알약 정보가 없습니다.' };
    }

    const data: TPillSearchParam = {
      PRINT_FRONT: res.PRINT.join(''),
      PRINT_BACK: res.PRINT.join(''),
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

    return { type: 'success', data };
  }, [serverData, mode, error, initData]);

  useEffect(() => {
    if (!resultData) return;
    if (isLoading) return;

    if (resultData.type === 'error') {
      nav.goBack();
      Toast.show({
        type: 'errorToast',
        text1: resultData.message,
      });
      return;
    }

    setSearchData({ data: resultData.data, mode });
  }, [resultData, isLoading, mode, setSearchData, nav]);

  if (isLoading || !resultData) {
    return <SkeletoneSearchResult />;
  }

  if (resultData.type === 'error') {
    return null;
  }

  return <SearchResultList />;
};

const SearchResult = (): React.JSX.Element => {
  const route: any = useRoute();
  const nav: any = useNavigation();
  const setScreen = useScreenStore((state) => state.setScreen);

  const paramsRef = useRef({ mode: 0, imageBase64: '' });

  const mode = route.params.mode ?? 0;
  const getImageBase64 = useSearchImgStore.getState;
  const resetSearchData = useSearchQueryStore(
    (state) => state.resetSearchQuery,
  );
  const resetSearchImage = useSearchImgStore((state) => state.resetSearchImg);

  const handleSetScreen = useCallback(() => {
    setScreen('검색 결과');
  }, [setScreen]);

  useEffect(() => {
    const unsubscribe = nav.addListener('focus', handleSetScreen);
    return () => {
      unsubscribe();
    };
  }, [handleSetScreen, nav]);

  useEffect(() => {
    paramsRef.current = { mode, imageBase64: getImageBase64().searchImgBase64 };
  }, [mode, getImageBase64]);

  useEffect(() => {
    return () => {
      const { mode, imageBase64 } = paramsRef.current;

      if (mode !== 0 && imageBase64) {
        const cacheKey = convertToCacheKey(imageBase64);
        const cached = searchPromiseCache.get(cacheKey);
        if (cached) {
          cached.controller.abort();
          searchPromiseCache.delete(cacheKey);
        }
      }
      resetSearchData();
      resetSearchImage();
    };
  }, []);

  return (
    <Layout.default>
      <ErrorBoundary FallbackComponent={SearchErrorHandler}>
        <SearchDataHandler />
      </ErrorBoundary>
    </Layout.default>
  );
};

export default SearchResult;
