import { RefObject } from 'react';
import * as Location from 'expo-location';
import MapView, { Region } from 'react-native-maps';
import { INearbyPharmacies } from '@services/database/types';
import { ICoordinate, TPharmacyClusterItem } from './pharmacy_map_type';
import {
  ILastFetchedCenter,
  IPharmacySearchCoordinates,
  IStockInquiryPillContext,
} from './pharmacy_domain_type';

// 위치 관리 훅 반환 타입
export interface IUsePharmacyLocationReturn {
  // 현재 사용자 위치 객체
  location: Location.LocationObject | null;

  // 지도 초기 렌더링 영역
  initialRegion: Region;

  // 지도 컴포넌트 참조 객체
  mapRef: RefObject<MapView | null>;

  // 현재 사용자 위치로 카메라 이동
  handleLocate: () => void;

  // 지정 좌표로 카메라 이동
  centerMapOn: (coords: ICoordinate) => void;

  // 위치 기반 서비스 초기화 파이프라인
  initializeLocation: () => Promise<void>;
}

// 약국 검색 훅 반환 타입
export interface IUsePharmacySearchReturn {
  // 조회된 약국 목록
  pharmacies: INearbyPharmacies[];

  // 로딩 상태 여부
  loading: boolean;

  // 마지막으로 조회가 수행된 지도 중심 좌표
  lastFetchedCenter: ILastFetchedCenter | null;

  // 특정 좌표 기준 약국 목록 비동기 조회
  fetchPharmacies: (
    coords: IPharmacySearchCoordinates,
  ) => Promise<INearbyPharmacies[] | undefined>;
}

// 약국 및 클러스터 선택 통합 상태 타입 (상호 배타적 단일 상태)
export type TPharmacySelectionState =
  | { type: 'pharmacy'; pharmacy: INearbyPharmacies }
  | { type: 'cluster'; pharmacies: INearbyPharmacies[] }
  | null;

// 약국 선택 및 클러스터 인터랙션 훅 반환 타입
export interface IUsePharmacySelectionReturn {
  // 현재 선택된 약국 정보
  selectedPharmacy: INearbyPharmacies | null;

  // 클러스터 탭 시 표시할 약국 목록
  clusterPharmacies: INearbyPharmacies[] | null;

  // 텍스트 클립보드 복사
  handleCopy: (text: string) => Promise<void>;

  // 마커 선택 이벤트 핸들러
  handleMarkerPress: (pharmacy: INearbyPharmacies) => void;

  // 상세 카드 닫기 핸들러
  handleCloseInfoCard: () => void;

  // 클러스터 약국 목록 열기
  openClusterList: (list: INearbyPharmacies[]) => void;

  // 클러스터 약국 목록 닫기
  closeClusterList: () => void;

  // 클러스터 목록 내 약국 선택 핸들러
  handleClusterPharmacySelect: (pharmacy: INearbyPharmacies) => void;
}

// 클러스터 선택 훅 매개변수 인터페이스
export interface IUseClusterSelectionParams {
  pharmacies: INearbyPharmacies[];
  getClusterPharmacyIds: (clusterId: number) => string[];
  openClusterList: (list: INearbyPharmacies[]) => void;
}

// 클러스터 선택 훅 반환 타입
export interface IUseClusterSelectionReturn {
  pharmaciesById: Map<string, INearbyPharmacies>;
  handleClusterPress: (clusterId: number) => void;
}

// 영업 중 필터 훅 반환 타입
export interface IUsePharmacyOpenFilterReturn {
  isOpenOnly: boolean;
  displayedPharmacies: INearbyPharmacies[];
  handleToggleOpenOnly: () => void;
}

// 지도 이동 시 재검색 훅 반환 타입
export interface IUseResearchPharmacyReturn {
  shouldResearch: boolean;
  handleResearchHere: () => Promise<void> | void;
}

// 재고 문의 훅 반환 타입
export interface IUseStockInquiryReturn {
  isStockInquiryMode: boolean;
  pillContext: IStockInquiryPillContext;
  handleStockInquiryCall: (telephone: string) => void;
}

// 클러스터 연산 훅 반환 타입
export interface IUsePharmacyClustersReturn {
  clusters: TPharmacyClusterItem[];
  getClusterPharmacyIds: (clusterId: number) => string[];
}
