import { INearbyPharmacies } from '@services/database/types';
import { Region } from 'react-native-maps';
import { AnyProps, ClusterFeature, PointFeature } from 'supercluster';

// 지도 좌표 인터페이스
export interface ICoordinate {
  // 위도
  latitude: number;

  // 경도
  longitude: number;
}

// 지도 영역 타입 re-export
export type IMapRegion = Region;
export type { Region };

// 클러스터 포인트 프로퍼티 인터페이스
export interface IPharmacyPointProps extends AnyProps {
  pharmacyId: string;
}

// 클러스터 아이템 타입
export type TPharmacyClusterItem =
  | PointFeature<IPharmacyPointProps>
  | ClusterFeature<AnyProps>;

// 약국 지도 마커 렌더링 Props 인터페이스
export interface IPharmacyMarkersProps {
  // 클러스터 아이템 목록
  clusters: TPharmacyClusterItem[];

  // ID로 인덱싱된 약국 맵
  pharmaciesById: Map<string, INearbyPharmacies>;

  // 현재 선택된 약국 ID
  selectedPharmacyId?: string;

  // 약국 마커 클릭 핸들러
  onPharmacyPress: (pharmacy: INearbyPharmacies) => void;

  // 클러스터 마커 클릭 핸들러
  onClusterPress: (clusterId: number) => void;
}

// 약국 클러스터 모달 목록 Props 인터페이스
export interface IPharmacyClusterListProps {
  // 클러스터에 포함된 약국 목록
  pharmacies: INearbyPharmacies[];

  // 약국 선택 핸들러
  onPharmacyPress: (pharmacy: INearbyPharmacies) => void;

  // 닫기 핸들러
  onClosePress: () => void;
}
