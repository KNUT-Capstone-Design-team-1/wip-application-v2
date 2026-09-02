import { useMemo } from 'react';
import Supercluster, {
  AnyProps,
  ClusterFeature,
  PointFeature,
} from 'supercluster';
import { Region } from 'react-native-maps';
import { INearbyPharmacies } from '@services/database/types';
import {
  CLUSTER_MAX_ZOOM,
  CLUSTER_MIN_POINTS,
  CLUSTER_RADIUS_PX,
} from '@features/nearby_pharmacy/constants/nearby_pharmacy';

export interface IPharmacyPointProps extends AnyProps {
  pharmacyId: string;
}

export type TPharmacyClusterItem =
  | PointFeature<IPharmacyPointProps>
  | ClusterFeature<AnyProps>;

// 약국 좌표 목록을 바탕으로 지도 영역별 클러스터링을 연산하는 커스텀 훅
export const usePharmacyClusters = (
  pharmacies: INearbyPharmacies[],
  region: Region | null,
) => {
  const supercluster = useMemo(() => {
    const index = new Supercluster<IPharmacyPointProps>({
      radius: CLUSTER_RADIUS_PX,
      maxZoom: CLUSTER_MAX_ZOOM,
      minPoints: CLUSTER_MIN_POINTS,
    });

    const points: PointFeature<IPharmacyPointProps>[] = [];

    for (const p of pharmacies) {
      const lat = parseFloat(p.Y);
      const lng = parseFloat(p.X);
      const isInvalidCoords = isNaN(lat) || isNaN(lng);

      if (isInvalidCoords) {
        continue;
      }

      points.push({
        type: 'Feature',
        properties: { pharmacyId: p.id },
        geometry: { type: 'Point', coordinates: [lng, lat] },
      });
    }

    index.load(points);
    return index;
  }, [pharmacies]);

  const clusters = useMemo<TPharmacyClusterItem[]>(() => {
    const hasNoRegion = !region;

    if (hasNoRegion || !region) {
      return [];
    }

    const zoom = Math.round(
      Math.log2(360 / Math.max(region.longitudeDelta, 0.00001)),
    );

    const bbox: [number, number, number, number] = [
      region.longitude - region.longitudeDelta / 2,
      region.latitude - region.latitudeDelta / 2,
      region.longitude + region.longitudeDelta / 2,
      region.latitude + region.latitudeDelta / 2,
    ];

    return supercluster.getClusters(bbox, zoom) as TPharmacyClusterItem[];
  }, [supercluster, region]);

  // 클러스터에 속한 모든 하위 약국 ID 반환
  const getClusterPharmacyIds = (clusterId: number): string[] => {
    const leaves = supercluster.getLeaves(
      clusterId,
      Infinity,
    ) as PointFeature<IPharmacyPointProps>[];

    return leaves.map((leaf) => leaf.properties.pharmacyId);
  };

  return { clusters, getClusterPharmacyIds };
};
