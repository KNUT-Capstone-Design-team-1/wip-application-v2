import axios from 'axios';
import { getToken } from './token';

interface INearbyPharmacyData {
  id: string; // 암호화요양기호
  name: string; // 요양기관명
  states: string; // 시도코드명
  region: string; // 시군구코드명
  district: string; // 읍면동
  postalCode: string; // 우편번호
  address: string; // 주소
  telephone: string; // 전화번호
  openDate: string; // 개설일자
  x: number; // 좌표(X)
  y: number; // 좌표(Y)
  distance: number; // 거리 (소수점)
}

interface INearbyPharmacyResponse {
  success: boolean;
  // Cloudflare workers metadata
  meta: {
    served_by: string;
    duration: number;
    changes: number;
    last_row_id: number;
    changed_db: boolean;
    size_after: number;
    rows_read: number;
    rows_written: number;
  };
  results: INearbyPharmacyData[];
}

type TNearbyPharmacySearchParam = Partial<
  Pick<
    INearbyPharmacyData,
    'states' | 'region' | 'district' | 'address' | 'x' | 'y'
  >
>;

/**
 * axios 인스턴스를 반환 (env 로드 문제로 함수 호출)
 * @returns
 */
const getAxiosInstance = () => {
  return axios.create({
    baseURL: process.env
      .EXPO_PUBLIC_CLOUD_FLARE_WIP_NEARBY_PHARMACY_URL as string,
  });
};

/**
 * 주변 약국 목록 조회
 * @param params 주변 약국 검색 파라미터
 * @returns
 */
export const requestGetNearbyPharmacies = async (
  params: TNearbyPharmacySearchParam,
) => {
  const token = await getToken();

  const response = await getAxiosInstance().get<INearbyPharmacyResponse>(
    `/nearby-pharmacies`,
    { params, headers: { 'x-auth-token': token } },
  );

  return response.data;
};
