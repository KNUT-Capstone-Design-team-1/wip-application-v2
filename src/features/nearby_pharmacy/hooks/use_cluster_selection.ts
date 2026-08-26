import { RefObject, useCallback, useMemo } from 'react';
import MapView from 'react-native-maps';
import { EdgeInsets } from 'react-native-safe-area-context';
import { INearbyPharmacies } from '@services/database/types';
import { px } from '@utils/responsive';
import { bottomTabSize } from '@constants/size';

interface IUseClusterSelectionParams {
  pharmacies: INearbyPharmacies[];
  mapRef: RefObject<MapView | null>;
  insets: EdgeInsets;
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
  insets,
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
        mapRef.current?.fitToCoordinates(coordinates, {
          edgePadding: {
            top: insets.top + px(80),
            right: px(60),
            bottom: bottomTabSize.height + insets.bottom + px(360),
            left: px(60),
          },
          animated: true,
        });
      }

      openClusterList(list);
    },
    [getClusterPharmacyIds, pharmaciesById, openClusterList, mapRef, insets],
  );

  return { pharmaciesById, handleClusterPress };
};
