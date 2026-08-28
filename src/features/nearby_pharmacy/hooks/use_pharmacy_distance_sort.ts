import { useMemo } from 'react';
import * as Location from 'expo-location';
import { INearbyPharmacies } from '@services/database/types';
import { getDistance } from '@features/nearby_pharmacy/utils/location';

// 사용자 위치를 기준으로 약국 배열을 가까운 거리순으로 정렬하는 커스텀 훅
export const usePharmacyDistanceSort = (
  pharmacies: INearbyPharmacies[],
  userLocation: Location.LocationObject | null,
) => {
  return useMemo(() => {
    if (!userLocation) {
      return pharmacies;
    }

    const { latitude, longitude } = userLocation.coords;

    return [...pharmacies].sort((a, b) => {
      const distA = getDistance(
        latitude,
        longitude,
        parseFloat(a.Y),
        parseFloat(a.X),
      );
      const distB = getDistance(
        latitude,
        longitude,
        parseFloat(b.Y),
        parseFloat(b.X),
      );

      return distA - distB;
    });
  }, [pharmacies, userLocation]);
};
