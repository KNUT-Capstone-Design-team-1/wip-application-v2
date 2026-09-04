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
  return (
    <>
      {clusters.map((item) => {
        const [longitude, latitude] = item.geometry.coordinates;

        // 네이티브 MapView에는 항상 유효한 좌표만 전달한다.
        const isInvalidCoordinate = !Number.isFinite(latitude) ||
          !Number.isFinite(longitude) ||
          latitude < -90 ||
          latitude > 90 ||
          longitude < -180 ||
          longitude > 180;

        if (isInvalidCoordinate) {
          return null;
        }

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
        const pharmacy = pharmaciesById.get(pharmacyId);
        const hasNoPharmacy = !pharmacy;

        if (hasNoPharmacy) {
          return null;
        }

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
