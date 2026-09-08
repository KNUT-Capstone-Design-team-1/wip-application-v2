import React, { memo } from 'react';
import PharmacyMarker from '@features/nearby_pharmacy/components/atoms/PharmacyMarker';
import PharmacyClusterMarker from '@features/nearby_pharmacy/components/atoms/PharmacyClusterMarker';
import { IPharmacyMarkersProps } from '@features/nearby_pharmacy/types/pharmacy_map_type';

const PharmacyMarkers = ({
  clusters,
  pharmaciesById,
  selectedPharmacyId,
  onPharmacyPress,
  onClusterPress,
}: IPharmacyMarkersProps) => {
  // 렌더링 전 유효한 마커만 완벽히 필터링하여 null 반환을 원천 차단한다.
  const validItems = clusters.filter((item) => {
    const [longitude, latitude] = item.geometry.coordinates;

    const isValidCoordinate =
      Number.isFinite(latitude) &&
      Number.isFinite(longitude) &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180;

    if (!isValidCoordinate) {
      return false;
    }

    const isCluster = 'cluster' in item.properties && item.properties.cluster;

    if (isCluster) {
      return true;
    }

    const pharmacyId = item.properties.pharmacyId as string;
    return Boolean(pharmaciesById.get(pharmacyId));
  });

  return (
    <>
      {validItems.map((item) => {
        const [longitude, latitude] = item.geometry.coordinates;
        const coordinate = { latitude, longitude };

        // 클러스터
        const isCluster =
          'cluster' in item.properties && item.properties.cluster;

        if (isCluster) {
          const clusterId = item.properties.cluster_id as number;
          const pointCount = item.properties.point_count as number;

          return (
            <PharmacyClusterMarker
              key={`cluster-${clusterId}`}
              coordinate={coordinate}
              count={pointCount}
              onPress={() => onClusterPress(clusterId)}
            />
          );
        }

        // 개별 약국
        const pharmacyId = item.properties.pharmacyId as string;
        const pharmacy = pharmaciesById.get(pharmacyId)!;

        return (
          <PharmacyMarker
            key={`pharmacy-${pharmacyId}`}
            coordinate={coordinate}
            pharmacy={pharmacy}
            selected={selectedPharmacyId === pharmacyId}
            onPress={onPharmacyPress}
          />
        );
      })}
    </>
  );
};

export default memo(PharmacyMarkers);
