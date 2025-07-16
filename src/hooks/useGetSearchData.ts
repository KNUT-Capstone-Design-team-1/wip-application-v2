import { postImageServer } from '@/api/server';
import { handleError } from '@/utils/error';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { TPillSearchParam } from '@/api/db/query';
import {
  useRecoilRefresher_UNSTABLE,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import { searchDataState } from '@/atoms/query';
import { searchFilterParams } from '@/selectors/query';
import { searchImageBase64State } from '@/selectors/searchImage';
import { searchImageAtom } from '@/atoms/searchImage';

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
  const setSearchData = useSetRecoilState(searchDataState);
  const resetSearchData = useResetRecoilState(searchDataState);
  const refreshFilter = useRecoilRefresher_UNSTABLE(searchFilterParams);
  const imageBase64 = useRecoilValue(searchImageBase64State);
  const resetSearchImage = useResetRecoilState(searchImageAtom);

  /** 검색 데이터 요청 - 초기 데이터 */
  const getImageData = async () => {
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
  };

  useEffect(() => {
    if (initData && mode == 0) {
      setSearchData({ data: initData, mode });
    }

    return () => {
      resetSearchData();
      resetSearchImage();
      refreshFilter();
    };
  }, []);

  useEffect(() => {
    if (imageBase64) {
      getImageData();
    }
  }, [imageBase64]);
};
