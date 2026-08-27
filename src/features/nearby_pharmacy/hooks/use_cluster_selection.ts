import { RefObject, useCallback, useMemo } from 'react';
import MapView, { Region } from 'react-native-maps';
import { INearbyPharmacies } from '@services/database/types';

interface IUseClusterSelectionParams {
  pharmacies: INearbyPharmacies[];
  mapRef: RefObject<MapView | null>;
  region: Region;
  getClusterPharmacyIds: (clusterId: number) => string[];
  openClusterList: (list: INearbyPharmacies[]) => void;
}

/**
 * 클러스터 마커 탭 시 지도 카메라를 클러스터 내 약국들에 맞추고
 * 하단 목록을 열어주는 로직.
 */
export const useClusterSelection = ({
  pharmacies,
  mapRef,
  region,
  getClusterPharmacyIds,
  openClusterList,
}: IUseClusterSelectionParams) => {
  const pharmaciesById = useMemo(() => {
    const map = new Map<string, INearbyPharmacies>();
    for (const p of pharmacies) {
      map.set(p.id, p);
    }
    return map;
  }, [pharmacies]);

  const handleClusterPress = useCallback(
    (clusterId: number) => {
      const ids = getClusterPharmacyIds(clusterId);
      const list = ids
        .map((id) => pharmaciesById.get(id))
        .filter((p): p is INearbyPharmacies => !!p);

      if (list.length === 0) {
        return;
      }

      const coordinates = list
        .map((p) => ({
          latitude: parseFloat(p.Y),
          longitude: parseFloat(p.X),
        }))
        .filter((c) => !isNaN(c.latitude) && !isNaN(c.longitude));

      if (coordinates.length > 0) {
        const centerLat =
          coordinates.reduce((sum, c) => sum + c.latitude, 0) /
          coordinates.length;

        const centerLng =
          coordinates.reduce((sum, c) => sum + c.longitude, 0) /
          coordinates.length;

        // 현재 줌에서 2배 확대 (델타 절반), 최대 확대 제한
        const newLatDelta = Math.max(region.latitudeDelta / 2, 0.002);
        const newLngDelta = Math.max(region.longitudeDelta / 2, 0.002);

        // 리스트가 하단을 가리므로 마커가 중앙보다 살짝 위쪽에 보이도록 보정
        const latOffset = newLatDelta * 0.15;

        mapRef.current?.animateToRegion(
          {
            latitude: centerLat - latOffset,
            longitude: centerLng,
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
