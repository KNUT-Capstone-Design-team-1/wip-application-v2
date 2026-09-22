import { useCallback, useMemo } from 'react';
import { INearbyPharmacies } from '@services/database/types';
import {
  IUseClusterSelectionParams,
  IUseClusterSelectionReturn,
} from '@features/nearby_pharmacy/types/nearby_pharmacy_hook_type';

// 클러스터 마커 선택 및 목록 노출 처리 훅
export const useClusterSelection = ({
  pharmacies,
  getClusterPharmacyIds,
  openClusterList,
}: IUseClusterSelectionParams): IUseClusterSelectionReturn => {
  // 약국 ID 기반 빠른 조회를 위한 Map 생성
  const pharmaciesById = useMemo(() => {
    const map = new Map<string, INearbyPharmacies>();
    for (const p of pharmacies) {
      map.set(p.id, p);
    }
    return map;
  }, [pharmacies]);

  // 클러스터 마커 클릭 핸들러 (확대 없이 하단 목록만 노출)
  const handleClusterPress = useCallback(
    (clusterId: number) => {
      const ids = getClusterPharmacyIds(clusterId);

      const list = ids
        .map((id) => pharmaciesById.get(id))
        .filter((p): p is INearbyPharmacies => !!p);

      const hasNoPharmacies = list.length === 0;

      if (hasNoPharmacies) {
        return;
      }

      // 지도 확대 없이 하단 약국 목록만 열기
      openClusterList(list);
    },
    [getClusterPharmacyIds, pharmaciesById, openClusterList],
  );

  return { pharmaciesById, handleClusterPress };
};
