import { postImageServer } from "@/api/server";
import { convertImgUriToBase64, getResizeImgUri } from "@/utils/image";
import { handleError } from "@/utils/error";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { getQueryForSearchId, getQueryForSearchImage, TPillSearchImageParam } from "@/api/db/query";

//TODO: 로직 변경 필요 => 식별 검색 결과 화면 로딩 필요
export const useGetSearchData = () => {
  const route: any = useRoute();
  const initData = route.params.data;
  const mode = route.params.mode ?? 0;
  const nav: any = useNavigation();
  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined);
  const [filter, setFilter] = useState<string | undefined>(undefined);
  const [params, setParams] = useState<any>(undefined);

  const setFilterParams = (data: any) => {
    const { filter, params } = mode == 1 ? getQueryForSearchImage(data) : getQueryForSearchId(data)
    setFilter(filter)
    setParams(params)
  }

  /** 검색 데이터 요청 - 초기 데이터 */
  const getImageData = async () => {
    await postImageServer(imageBase64)
      .then((res: any) => {
        if (res.data.success) {
          const data: TPillSearchImageParam = { ITEM_SEQ: [] }
          for (const d of res.data.data) {
            data.ITEM_SEQ.push(d.ITEM_SEQ as string)
          }
          setFilterParams(data)
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
      setFilterParams(initData)
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
  }, [initData])

  useEffect(() => {
    if (imageBase64) {
      getImageData();
    }

  }, [imageBase64])

  return { filter, params }
}