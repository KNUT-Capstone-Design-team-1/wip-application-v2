import React, { memo } from 'react';
import PharmacyMarker from '@features/nearby_pharmacy/components/atoms/PharmacyMarker';
import PharmacyClusterMarker from '@features/nearby_pharmacy/components/atoms/PharmacyClusterMarker';
import { IPharmacyMarkersProps } from '@features/nearby_pharmacy/types/nearby_pharmacy';

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
        const coordinate = { latitude, longitude };

        // 클러스터
        if ('cluster' in item.properties && item.properties.cluster) {
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
        if (!pharmacy) {
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
