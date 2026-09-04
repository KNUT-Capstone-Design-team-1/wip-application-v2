import { RefObject, useCallback, useMemo } from 'react';
import MapView, { Region } from 'react-native-maps';
import { INearbyPharmacies } from '@services/database/types';
import { nearbyPharmacyService } from '@features/nearby_pharmacy/services/nearby_pharmacy_service';

// 클러스터 선택 훅 매개변수 인터페이스
interface IUseClusterSelectionParams {
  pharmacies: INearbyPharmacies[];
  mapRef: RefObject<MapView | null>;
  region: Region;
  getClusterPharmacyIds: (clusterId: number) => string[];
  openClusterList: (list: INearbyPharmacies[]) => void;
}

// 클러스터 마커 선택 및 지도 포커스/목록 표시 커스텀 훅 (Presentation Layer)
export const useClusterSelection = ({
  pharmacies,
  mapRef,
  region,
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

  // 클러스터 마커 클릭 핸들러
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

      const center = nearbyPharmacyService.calculateCenterCoordinate(list);

      const hasCenter = Boolean(center);

      if (hasCenter) {
        // 현재 줌에서 2배 확대 (델타 절반), 최대 확대 제한
        const newLatDelta = Math.max(region.latitudeDelta / 2, 0.002);
        const newLngDelta = Math.max(region.longitudeDelta / 2, 0.002);

        // 리스트가 하단을 가리므로 마커가 중앙보다 살짝 위쪽에 보이도록 보정
        const latOffset = newLatDelta * 0.15;

        mapRef.current?.animateToRegion(
          {
            latitude: center.latitude - latOffset,
            longitude: center.longitude,
            latitudeDelta: newLatDelta,
            longitudeDelta: newLngDelta,
          },
          400,
        );
      }

      openClusterList(list);
    },
    [getClusterPharmacyIds, pharmaciesById, openClusterList, mapRef, region],
  );

  return { pharmaciesById, handleClusterPress };
};
