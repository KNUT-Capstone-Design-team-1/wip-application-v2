import { RefObject, useCallback, useMemo } from 'react';
import MapView, { Region } from 'react-native-maps';
import { INearbyPharmacies } from '@services/database/types';

// 클러스터 선택 훅 매개변수 인터페이스
interface IUseClusterSelectionParams {
  pharmacies: INearbyPharmacies[];
  mapRef?: RefObject<MapView | null>;
  region?: Region;
  getClusterPharmacyIds: (clusterId: number) => string[];
  openClusterList: (list: INearbyPharmacies[]) => void;
}

// 클러스터 마커 선택 및 목록 표시 커스텀 훅 (Presentation Layer)
export const useClusterSelection = ({
  pharmacies,
  getClusterPharmacyIds,
  openClusterList,
}: IUseClusterSelectionParams) => {
  // 약국 ID 기반 빠른 조회를 위한 Map 생성
  const pharmaciesById = useMemo(() => {
    const map = new Map<string, INearbyPharmacies>();
    for (const p of pharmacies) {
      map.set(p.id, p);
    }
    return map;
  }, [pharmacies]);

  // 클러스터 마커 클릭 핸들러 (선택 시 줌 없이 목록만 오픈)
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

      openClusterList(list);
    },
    [getClusterPharmacyIds, pharmaciesById, openClusterList],
  );

  return { pharmaciesById, handleClusterPress };
};
