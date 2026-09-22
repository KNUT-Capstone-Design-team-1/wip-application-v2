import React, { memo } from 'react';
import PharmacyMarker from '@features/nearby_pharmacy/components/atoms/PharmacyMarker';
import PharmacyClusterMarker from '@features/nearby_pharmacy/components/atoms/PharmacyClusterMarker';
import SelectedPharmacyMarker from '@features/nearby_pharmacy/components/atoms/SelectedPharmacyMarker';
import { IPharmacyMarkersProps } from '@features/nearby_pharmacy/types/pharmacy_map_type';
import { INearbyPharmacies } from '@services/database/types';

const PharmacyMarkers = ({
  clusters,
  pharmaciesById,
  selectedPharmacyId,
  getClusterPharmacyIds,
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

  // 현재 선택된 약국 객체 조회 (선택 전용 단일 오버레이 핀 마커 렌더링에 사용)
  const selectedPharmacy = selectedPharmacyId
    ? pharmaciesById.get(selectedPharmacyId)
    : undefined;

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

          const clusterPharmacyIds = getClusterPharmacyIds
            ? getClusterPharmacyIds(clusterId)
            : [];
          const hasSelectedPharmacyId = Boolean(selectedPharmacyId);
          const containsSelectedPharmacy =
            hasSelectedPharmacyId &&
            clusterPharmacyIds.includes(selectedPharmacyId!);

          // 선택된 약국이 해당 클러스터에 포함되어 있는 경우, 클러스터를 완전히 해제하여 모든 약국을 개별 마커로 렌더링
          if (containsSelectedPharmacy) {
            const memberPharmacies = clusterPharmacyIds
              .map((id) => pharmaciesById.get(id))
              .filter((p): p is INearbyPharmacies => Boolean(p));

            return (
              <React.Fragment key={`cluster-expanded-${clusterId}`}>
                {memberPharmacies.map((pharmacy) => {
                  const isSelected = pharmacy.id === selectedPharmacyId;
                  const lat = Number.parseFloat(pharmacy.Y);
                  const lng = Number.parseFloat(pharmacy.X);
                  const isValidCoord =
                    Number.isFinite(lat) && Number.isFinite(lng);

                  if (!isValidCoord) {
                    return null;
                  }

                  return (
                    <PharmacyMarker
                      key={pharmacy.id}
                      coordinate={{
                        latitude: lat,
                        longitude: lng,
                      }}
                      pharmacy={pharmacy}
                      selected={isSelected}
                      onPress={onPharmacyPress}
                    />
                  );
                })}
              </React.Fragment>
            );
          }

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
        const isSelected = selectedPharmacyId === pharmacyId;

        return (
          <PharmacyMarker
            key={pharmacyId}
            coordinate={coordinate}
            pharmacy={pharmacy}
            selected={isSelected}
            onPress={onPharmacyPress}
          />
        );
      })}

      {/* 선택된 약국을 지도 최상단에 안정적으로 표시하는 단일 오버레이 마커 */}
      {selectedPharmacy && (
        <SelectedPharmacyMarker
          coordinate={{
            latitude: Number.parseFloat(selectedPharmacy.Y),
            longitude: Number.parseFloat(selectedPharmacy.X),
          }}
          onPress={() => onPharmacyPress(selectedPharmacy)}
        />
      )}
    </>
  );
};

export default memo(PharmacyMarkers);
