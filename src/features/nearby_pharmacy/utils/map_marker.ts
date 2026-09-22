import { LatLng } from 'react-native-maps';
import { INearbyPharmacies } from '@services/database/types';
import { TPharmacyClusterItem } from '@features/nearby_pharmacy/types/pharmacy_map_type';

// 위경도 좌표 유효성 검증
export const isValidCoordinate = (
  latitude: number,
  longitude: number,
): boolean => {
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
};

// 약국 객체에서 유효한 위경도 좌표 추출
export const getPharmacyCoordinate = (
  pharmacy: INearbyPharmacies | null | undefined,
): LatLng | null => {
  if (!pharmacy) {
    return null;
  }

  const latitude = parseFloat(pharmacy.Y);
  const longitude = parseFloat(pharmacy.X);

  if (!isValidCoordinate(latitude, longitude)) {
    return null;
  }

  return { latitude, longitude };
};

// 지도에 렌더링할 유효한 클러스터 및 개별 마커 아이템 필터링
export const filterValidClusterItems = (
  clusters: TPharmacyClusterItem[],
  pharmaciesById: Map<string, INearbyPharmacies>,
): TPharmacyClusterItem[] => {
  return clusters.filter((item) => {
    const [longitude, latitude] = item.geometry.coordinates;

    if (!isValidCoordinate(latitude, longitude)) {
      return false;
    }

    const isCluster = 'cluster' in item.properties && item.properties.cluster;

    if (isCluster) {
      return true;
    }

    const pharmacyId = item.properties.pharmacyId as string;

    return Boolean(pharmaciesById.get(pharmacyId));
  });
};
