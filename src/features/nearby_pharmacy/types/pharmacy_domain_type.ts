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

// 약국 검색 좌표 타입
export interface IPharmacySearchCoordinates {
  x: number;
  y: number;
}

// 약국 목록 조회 옵션 타입
export interface IPharmacySearchOptions {
  page?: number;
  limit?: number;
  maxRadiusKm?: number;
}

// 마지막 약국 조회 중심 좌표 타입
export interface ILastFetchedCenter {
  lat: number;
  lng: number;
}

// 재고 문의를 위한 대상 알약 컨텍스트 모델
export interface IStockInquiryPillContext {
  seq?: string;
  name?: string;
  entpName?: string;
  className?: string;
  image?: string;
}

// 위치 가용성 검증 결과 타입
export type TLocationCheckResult =
  | { success: true }
  | { success: false; reason: 'permission_denied' | 'gps_disabled' };

// 전화 걸기 액션 결과 모델
export interface IPharmacyCallResult {
  // 성공 여부
  success: boolean;

  // 실패 시 에러 사유
  errorMessage?: string;
}

// 텍스트 클립보드 복사 결과 모델
export interface IPharmacyCopyResult {
  // 성공 여부
  success: boolean;

  // 복사된 텍스트 내용
  copiedText?: string;
}
