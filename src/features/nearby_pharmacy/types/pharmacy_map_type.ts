import { INearbyPharmacies } from '@services/database/types';
import { RefObject } from 'react';
import { EdgeInsets } from 'react-native-safe-area-context';
import MapView, { LatLng, Region } from 'react-native-maps';
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

export type TPharmacyPointFeature = PointFeature<IPharmacyPointProps>;

// 클러스터 아이템 타입
export type TPharmacyClusterItem =
  PointFeature<IPharmacyPointProps> | ClusterFeature<AnyProps>;

export interface IPharmacyMarkerProps {
  coordinate: LatLng;
  pharmacy: INearbyPharmacies;
  selected: boolean;
  onPress: (pharmacy: INearbyPharmacies) => void;
}

export interface IPharmacyClusterMarkerProps {
  coordinate: LatLng;
  count: number;
  onPress: () => void;
}

export interface IPharmacyMapProps {
  mapRef: RefObject<MapView | null>;
  initialRegion: Region;
  onRegionChangeComplete: (region: Region) => void;
  insets: EdgeInsets;
  clusters: TPharmacyClusterItem[];
  pharmaciesById: Map<string, INearbyPharmacies>;
  selectedPharmacy?: INearbyPharmacies | null;
  selectedPharmacyId?: string;
  getClusterPharmacyIds?: (clusterId: number) => string[];
  onPharmacyPress: (pharmacy: INearbyPharmacies) => void;
  onClusterPress: (clusterId: number) => void;
}

// MapView 직속 마커 렌더링 매개변수 인터페이스
export interface IRenderPharmacyMarkersParams {
  validItems: TPharmacyClusterItem[];
  pharmaciesById: Map<string, INearbyPharmacies>;
  selectedPharmacy?: INearbyPharmacies | null;
  selectedPharmacyId?: string;
  selectedCoordinate: LatLng | null;
  getClusterPharmacyIds?: (clusterId: number) => string[];
  onPharmacyPress: (pharmacy: INearbyPharmacies) => void;
  onClusterPress: (clusterId: number) => void;
}
