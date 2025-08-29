import { postImageServer } from '@/api/server';
import { handleError } from '@/utils/error';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { TPillSearchParam } from '@/api/db/query';
import { useSearchQueryStore } from '@/store/searchQueryStore';
import { useSearchImgStore } from '@/store/searchImgStore';

type TResImageData = { PRINT: string[]; SHAPE: string[]; COLOR: string[] };

interface ITResImageData {
  res: TResImageData;
  status: number;
  message: string;
}

export const useGetSearchData = () => {
  const route: any = useRoute();
  const mode = route.params.mode ?? 0;
  const initData = route.params.data;
  const nav: any = useNavigation();
  const setSearchData = useSearchQueryStore((state) => state.setSearchQuery);
  const resetSearchData = useSearchQueryStore(
    (state) => state.resetSearchQuery,
  );
  const imageBase64 = useSearchImgStore((state) => state.searchImgBase64);
  const resetSearchImage = useSearchImgStore((state) => state.resetSearchImg);

  /** 검색 데이터 요청 - 초기 데이터 */
  const getImageData = useCallback(async () => {
    const { res, status, message } = (await postImageServer(
      imageBase64,
    )) as ITResImageData;

    try {
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
      };

      const [resPRINT_FRONT = '', resPRINT_BACK = ''] = res.PRINT;
      if (resPRINT_FRONT.length > 0) {
        data['PRINT_FRONT'] =
          '*' + resPRINT_FRONT.replace(/(?<=.)|(?=.)/g, '*');
      }

      if (resPRINT_BACK.length > 0) {
        data['PRINT_BACK'] = '*' + resPRINT_BACK.replace(/(?<=.)|(?=.)/g, '*');
      }

      setSearchData({ data, mode });
      return;
    } catch (error) {
      const text = handleError(error);

      nav.goBack();
      Toast.show({
        type: 'errorToast',
        text1: `알약검색에 실패했습니다.${text}`,
      });
    }
  }, [imageBase64, nav, setSearchData, mode]);

  useEffect(() => {
    if (initData && mode === 0) {
      setSearchData({ data: initData, mode });
    }

    return () => {
      resetSearchData();
      resetSearchImage();
    };
  }, [initData, mode, resetSearchData, resetSearchImage, setSearchData]);

  useEffect(() => {
    if (imageBase64) {
      getImageData();
    }
  }, [getImageData, imageBase64]);
};
