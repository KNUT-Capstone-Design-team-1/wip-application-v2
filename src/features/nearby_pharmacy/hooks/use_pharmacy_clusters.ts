import { useMemo, useCallback } from 'react';
import { Region } from 'react-native-maps';
import { INearbyPharmacies } from '@services/database/types';
import { TPharmacyClusterItem } from '@features/nearby_pharmacy/types/pharmacy_map_type';
import { pharmacyClusterService } from '@features/nearby_pharmacy/services/pharmacy_cluster_service';

// 약국 좌표 목록을 바탕으로 지도 영역별 클러스터링을 연산하는 커스텀 훅 (Presentation Layer)
export const usePharmacyClusters = (
  pharmacies: INearbyPharmacies[],
  region: Region | null,
) => {
  // Supercluster 인덱스 생성 및 약국 좌표 로드
  const clusterIndex = useMemo(() => {
    return pharmacyClusterService.createIndex(pharmacies);
  }, [pharmacies]);

  // 지도 영역 변경 시 화면에 표시할 클러스터 및 마커 계산
  const clusters = useMemo((): TPharmacyClusterItem[] => {
    return pharmacyClusterService.getClusters(clusterIndex, region);
  }, [clusterIndex, region]);

  // 특정 클러스터에 속한 모든 약국 ID 목록 반환 함수
  const getClusterPharmacyIds = useCallback(
    (clusterId: number): string[] => {
      return pharmacyClusterService.getClusterPharmacyIds(clusterIndex, clusterId);
    },
    [clusterIndex],
  );

  return {
    clusters,
    clusterIndex,
    getClusterPharmacyIds,
  };
};
