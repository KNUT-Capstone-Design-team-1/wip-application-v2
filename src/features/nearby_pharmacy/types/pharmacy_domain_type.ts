import { INearbyPharmacies } from '@services/database/types';
import * as Location from 'expo-location';

// 약국 도메인 모델 인터페이스
export type IPharmacy = INearbyPharmacies;

// 주변 약국 화면의 전역 상태 모델
export interface INearbyPharmacyState {
  // 사용자의 현재 위치 정보
  location: Location.LocationObject | null;

  // 조회된 주변 약국 목록
  pharmacies: INearbyPharmacies[];

  // 로딩 상태 여부
  loading: boolean;

  // 에러 메시지
  errorMsg: string | null;
}

// 주변 약국 쿼리 파라미터 인터페이스
export interface IPharmacyQueryParams {
  // 중심 위도
  latitude: number;

  // 중심 경도
  longitude: number;

  // 검색 반경 (km)
  radiusKm: number;

  // 최대 조회 건수
  limit: number;
}
