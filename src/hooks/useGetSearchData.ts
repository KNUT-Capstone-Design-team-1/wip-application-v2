import { convertImgUriToBase64, getResizeImgUri } from "@/utils/image";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useState } from "react";
import Config from "react-native-config";
import Toast from "react-native-toast-message";

// 페이징 데이터 제한
const limit = 10;

export const useGetSearchData = () => {
  const route: any = useRoute();
  const mergedImgUri = route.params.data;
  const nav: any = useNavigation();
  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined);
  const [data, setData] = useState<any[] | undefined>(undefined);
  const [finishData, setFinishData] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [infiLoading, setInfiLoading] = useState<boolean>(false);
  const isVisible = !!(!isLoading && data);

  /** 검색 데이터 요청 - 초기 데이터 */
  const getInitData = async () => {
    const URL = Config.API_URL + `/pill-search/image`;
    const base64 = imageBase64;
    setIsLoading(true);
    await axios.post(URL, { base64 }, { timeout: 1000 * 120 })
      .then((res: any) => {
        setIsLoading(false);
        if (res.data.success) {
          setData(res.data.data.pillInfoList);
        } else {
          nav.goBack();
          Toast.show({
            type: 'errorToast',
            text1: res.data.message ?? '알약검색에 실패했습니다. (Unknown)',
          });
        }
      })
      .catch(error => {
        const status = error.response?.status;
        let text: string = '';

        switch (status) {
          case 401:
            text = ' (인증오류)'
            break;
          case 404:
            text = ' (not found)'
            break;
          case 408:
            text = ' (요청만료)'
            break;
          case 500:
            text = ' (서버통신오류)'
            break;
          case undefined:
            text = ` (${error.code})`
            break;
          default:
            text = `\n(${status} : ${error.code})`
            break;
        }

        nav.goBack();
        Toast.show({
          type: 'errorToast',
          text1: `알약검색에 실패했습니다.${text}`,
        });
      });

    /** [임시 제거] 검색 데이터 요청 - 페이징 기능 */
    const getDataByPage = async () => {
      if (data && data.length >= 10) {
        const URL = Config.API_URL + `/pill-search/image?skip=${(page + 1) * limit}&limit=${limit}`;
        const base64 = imageBase64;
        if (!finishData) {
          setInfiLoading(true);
          await axios.post(URL, { base64 }, { timeout: 1000 * 120 }).then((res: any) => {
            if (res.data.success && !!data) {
              let pre = [...data, ...res.data.data.pillInfoList];
              setData(pre);
              setPage(prev => prev + 1);
              setInfiLoading(false);
              if (res.data.data.pillInfoList.length < 10) {
                setFinishData(true);
              }
            } else {
            }
          }).catch(error => {
            setInfiLoading(false);
          });
        }
      }
    }
  }

  useEffect(() => {
    if (mergedImgUri) {
      getResizeImgUri(mergedImgUri).then((resized: string) => {
        convertImgUriToBase64(resized).then((base64String: any) => {
          setImageBase64(base64String);
        })
      }).catch((error) => {
        console.error('Error:', error);
      });
    }
  }, [mergedImgUri])

  useEffect(() => {
    if (imageBase64) {
      getInitData();
    }
    setIsLoading(true);

  }, [imageBase64])

  return { data, isVisible, infiLoading }
}