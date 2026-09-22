import Supercluster from 'supercluster';
import { Region } from 'react-native-maps';
import { INearbyPharmacies } from '@services/database/types';
import {
  CLUSTER_MAX_ZOOM,
  CLUSTER_MIN_POINTS,
  CLUSTER_RADIUS_PX,
  CLUSTER_LEAF_LIMIT,
} from '@features/nearby_pharmacy/constants/map';
import {
  IPharmacyPointProps,
  TPharmacyClusterItem,
  TPharmacyPointFeature,
} from '@features/nearby_pharmacy/types/pharmacy_map_type';
import { isValidCoordinate } from '@features/nearby_pharmacy/utils/map_marker';

export const pharmacyClusterService = {
  // 약국 좌표 목록으로 Supercluster 인덱스 생성
  createIndex(
    pharmacies: INearbyPharmacies[],
  ): Supercluster<IPharmacyPointProps> | null {
    const hasNoPharmacies = pharmacies.length === 0;

    if (hasNoPharmacies) {
      return null;
    }

    const index = new Supercluster<IPharmacyPointProps>({
      radius: CLUSTER_RADIUS_PX,
      maxZoom: CLUSTER_MAX_ZOOM,
      minPoints: CLUSTER_MIN_POINTS,
    });
    const points: TPharmacyPointFeature[] = [];

    for (const pharmacy of pharmacies) {
      const longitude = Number.parseFloat(pharmacy.X);
      const latitude = Number.parseFloat(pharmacy.Y);

      if (!isValidCoordinate(latitude, longitude)) {
        continue;
      }

      points.push({
        type: 'Feature',
        properties: { pharmacyId: pharmacy.id },
        geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
      });
    }

    const hasNoValidPoints = points.length === 0;

    if (hasNoValidPoints) {
      return null;
    }

    index.load(points);
    return index;
  },

  // 현재 지도 뷰포트 영역의 클러스터 및 마커 목록 조회
  getClusters(
    index: Supercluster<IPharmacyPointProps> | null,
    region: Region | null,
  ): TPharmacyClusterItem[] {
    if (!index || !region) {
      return [];
    }

    const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
    const hasInvalidRegion =
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      !Number.isFinite(latitudeDelta) ||
      !Number.isFinite(longitudeDelta) ||
      latitudeDelta <= 0 ||
      longitudeDelta <= 0;

    if (hasInvalidRegion) {
      return [];
    }

    const bbox: [number, number, number, number] = [
      longitude - longitudeDelta / 2,
      latitude - latitudeDelta / 2,
      longitude + longitudeDelta / 2,
      latitude + latitudeDelta / 2,
    ];
    const zoom = Math.round(Math.log2(360 / latitudeDelta));
    const clampedZoom = Math.min(Math.max(zoom, 0), CLUSTER_MAX_ZOOM);

    return index.getClusters(bbox, clampedZoom);
  },

  // 클러스터에 포함된 약국 ID 목록 반환
  getClusterPharmacyIds(
    index: Supercluster<IPharmacyPointProps> | null,
    clusterId: number,
    limit: number = CLUSTER_LEAF_LIMIT,
  ): string[] {
    const hasNoIndex = !index;

    if (hasNoIndex) {
      return [];
    }

    return index
      .getLeaves(clusterId, limit)
      .map((leaf) => leaf.properties.pharmacyId);
  },
};
