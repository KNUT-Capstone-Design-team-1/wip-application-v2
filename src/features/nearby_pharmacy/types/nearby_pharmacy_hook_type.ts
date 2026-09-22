import { RefObject } from 'react';
import * as Location from 'expo-location';
import MapView, { Region } from 'react-native-maps';
import { INearbyPharmacies } from '@services/database/types';
import { ICoordinate } from './pharmacy_map_type';
import {
  ILastFetchedCenter,
  IPharmacySearchCoordinates,
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
  fetchPharmacies: (coords: IPharmacySearchCoordinates) => Promise<void>;
}

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
  mapRef: RefObject<MapView | null>;
  region: Region;
  getClusterPharmacyIds: (clusterId: number) => string[];
  openClusterList: (list: INearbyPharmacies[]) => void;
}
