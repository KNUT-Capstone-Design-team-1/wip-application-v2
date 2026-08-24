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

/**
 * region + pharmacies 기반 supercluster 인덱스와 현재 화면에 표시할 클러스터/포인트를 반환.
 */
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
      if (isNaN(lat) || isNaN(lng)) continue;

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
    if (!region) return [];

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

  /**
   * 클러스터에 속한 모든 leaf point 의 pharmacyId 반환
   */
  const getClusterPharmacyIds = (clusterId: number): string[] => {
    const leaves = supercluster.getLeaves(
      clusterId,
      Infinity,
    ) as PointFeature<IPharmacyPointProps>[];

    return leaves.map((leaf) => leaf.properties.pharmacyId);
  };

  return { clusters, getClusterPharmacyIds };
};
