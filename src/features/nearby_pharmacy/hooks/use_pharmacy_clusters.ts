import { useMemo, useCallback } from 'react';
import Supercluster from 'supercluster';
import { Region } from 'react-native-maps';
import { INearbyPharmacies } from '@services/database/types';
import {
  CLUSTER_MAX_ZOOM,
  CLUSTER_MIN_POINTS,
  CLUSTER_RADIUS_PX,
} from '@features/nearby_pharmacy/constants/nearby_pharmacy';
import {
  IPharmacyPointProps,
  TPharmacyClusterItem,
} from '@features/nearby_pharmacy/types/pharmacy_map_type';

export type { IPharmacyPointProps, TPharmacyClusterItem };

// 약국 좌표 목록을 바탕으로 지도 영역별 클러스터링을 연산하는 커스텀 훅 (Presentation Layer)
export const usePharmacyClusters = (
  pharmacies: INearbyPharmacies[],
  region: Region | null,
) => {
  // Supercluster 인덱스 생성 및 약국 좌표 로드
  const clusterIndex = useMemo(() => {
    const hasNoPharmacies = pharmacies.length === 0;

    if (hasNoPharmacies) {
      return null;
    }

    const index = new Supercluster<IPharmacyPointProps>({
      radius: CLUSTER_RADIUS_PX,
      maxZoom: CLUSTER_MAX_ZOOM,
      minPoints: CLUSTER_MIN_POINTS,
    });

    const points = pharmacies.map((pharmacy) => ({
      type: 'Feature' as const,
      properties: {
        pharmacyId: pharmacy.id,
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [parseFloat(pharmacy.X), parseFloat(pharmacy.Y)],
      },
    }));

    index.load(points);

    return index;
  }, [pharmacies]);

  // 지도 영역 변경 시 화면에 표시할 클러스터 및 마커 계산
  const clusters = useMemo((): TPharmacyClusterItem[] => {
    const isReady = clusterIndex && region;

    if (!isReady) {
      return [];
    }

    const { latitude, longitude, latitudeDelta, longitudeDelta } = region;

    // 바운딩 박스 계산: [서쪽 경도, 남쪽 위도, 동쪽 경도, 북쪽 위도]
    const bbox: [number, number, number, number] = [
      longitude - longitudeDelta / 2,
      latitude - latitudeDelta / 2,
      longitude + longitudeDelta / 2,
      latitude + latitudeDelta / 2,
    ];

    // 줌 레벨 계산 (latitudeDelta 기반 근사치)
    const zoom = Math.round(Math.log2(360 / latitudeDelta));
    const clampedZoom = Math.min(Math.max(zoom, 0), CLUSTER_MAX_ZOOM);

    return clusterIndex.getClusters(bbox, clampedZoom);
  }, [clusterIndex, region]);

  // 특정 클러스터에 속한 모든 약국 ID 목록 반환 함수
  const getClusterPharmacyIds = useCallback(
    (clusterId: number): string[] => {
      const hasNoIndex = !clusterIndex;

      if (hasNoIndex) {
        return [];
      }

      const leaves = clusterIndex.getLeaves(clusterId, Infinity);

      return leaves.map((leaf) => leaf.properties.pharmacyId);
    },
    [clusterIndex],
  );

  return {
    clusters,
    clusterIndex,
    getClusterPharmacyIds,
  };
};
