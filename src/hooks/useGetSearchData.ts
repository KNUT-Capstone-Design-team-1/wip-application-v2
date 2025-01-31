import { postImageServer } from "@/api/server";
import { convertImgUriToBase64, getResizeImgUri } from "@/utils/image";
import { handleError } from "@/utils/error";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { TPillSearchImageParam } from "@/api/db/query";
import { useRecoilRefresher_UNSTABLE, useResetRecoilState, useSetRecoilState } from "recoil";
import { searchDataState } from "@/atoms/query";
import { searchFilterParams } from "@/selectors/query";

export const useGetSearchData = () => {
  const route: any = useRoute();
  const mode = route.params.mode ?? 0;
  const initData = route.params.data
  const nav: any = useNavigation();
  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined);
  const setSearchData = useSetRecoilState(searchDataState)
  const resetSearchData = useResetRecoilState(searchDataState)
  const refreshFilter = useRecoilRefresher_UNSTABLE(searchFilterParams)

  /** 검색 데이터 요청 - 초기 데이터 */
  const getImageData = async () => {
    await postImageServer(imageBase64)
      .then((res: any) => {
        if (res.data.success) {
          const data: TPillSearchImageParam = { ITEM_SEQ: [] }
          for (const d of res.data.data) {
            data.ITEM_SEQ.push(d.ITEM_SEQ as string)
          }
          setSearchData({ data, mode })
        } else {
          nav.goBack();
          Toast.show({
            type: 'errorToast',
            text1: res.data.message ?? '알약검색에 실패했습니다. (Unknown)',
          });
        }
      })
      .catch(error => {
        const text = handleError(error)

        nav.goBack();
        Toast.show({
          type: 'errorToast',
          text1: `알약검색에 실패했습니다.${text}`,
        });
      });
  }

  useEffect(() => {
    if (initData && mode == 0) {
      setSearchData({ data: initData, mode })
    }

    if (initData && mode == 1) {
      getResizeImgUri(initData).then((resized: string) => {
        convertImgUriToBase64(resized).then((base64String: any) => {
          setImageBase64(base64String);
        })
      }).catch((error) => {
        console.error('Error:', error);
      });
    }

    return (() => {
      resetSearchData()
      refreshFilter()
    })

  }, [])

  useEffect(() => {
    if (imageBase64) {
      getImageData();
    }

  }, [imageBase64])
}