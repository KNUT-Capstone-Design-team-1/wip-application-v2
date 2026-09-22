import React, { ReactNode } from 'react';
import PharmacyMarker from '@features/nearby_pharmacy/components/atoms/PharmacyMarker';
import PharmacyClusterMarker from '@features/nearby_pharmacy/components/atoms/PharmacyClusterMarker';
import { IRenderPharmacyMarkersParams } from '@features/nearby_pharmacy/types/pharmacy_map_type';

// MapView 직속 자식 마커 배열 생성 렌더 헬퍼 함수
export const renderPharmacyMarkers = ({
  validItems,
  pharmaciesById,
  selectedPharmacy,
  selectedPharmacyId,
  selectedCoordinate,
  getClusterPharmacyIds,
  onPharmacyPress,
  onClusterPress,
}: IRenderPharmacyMarkersParams): ReactNode[] => {
  const markerNodes: ReactNode[] = [];
  let isSelectedInCluster = false;

  for (const item of validItems) {
    const [longitude, latitude] = item.geometry.coordinates;
    const coordinate = { latitude, longitude };
    const isCluster = 'cluster' in item.properties && item.properties.cluster;

    // 클러스터 마커
    if (isCluster) {
      const clusterId = item.properties.cluster_id as number;
      const pointCount = item.properties.point_count as number;

      // 선택된 약국이 해당 클러스터에 포함되어 있는지 확인
      if (selectedPharmacyId && getClusterPharmacyIds) {
        const clusterPharmacyIds = getClusterPharmacyIds(clusterId);
        if (clusterPharmacyIds.includes(selectedPharmacyId)) {
          isSelectedInCluster = true;
        }
      }

      markerNodes.push(
        <PharmacyClusterMarker
          key={`cluster-${clusterId}`}
          coordinate={coordinate}
          count={pointCount}
          onPress={() => onClusterPress(clusterId)}
        />,
      );
      continue;
    }

    // 개별 약국 마커
    const pharmacyId = item.properties.pharmacyId as string;
    const pharmacy = pharmaciesById.get(pharmacyId);

    if (!pharmacy) {
      continue;
    }

    // 선택된 약국은 단일 선택 핀 마커로 별도 렌더링하므로 일반 목록에서는 제외
    if (selectedPharmacyId === pharmacyId) {
      continue;
    }

    markerNodes.push(
      <PharmacyMarker
        key={`pharmacy-${pharmacyId}`}
        coordinate={coordinate}
        pharmacy={pharmacy}
        selected={false}
        onPress={onPharmacyPress}
      />,
    );
  }

  // 선택된 약국 전용 단일 마커 (지도 최상단 노출 및 단일 선택 보장)
  // 단, 선택된 약국이 클러스터 내에 묶여 있는 경우에는 클러스터 마커를 유지하고 선택 핀 마커 중복 노출 방지
  if (selectedPharmacy && selectedCoordinate && !isSelectedInCluster) {
    markerNodes.push(
      <PharmacyMarker
        key={`selected-pharmacy-${selectedPharmacy.id}`}
        coordinate={selectedCoordinate}
        pharmacy={selectedPharmacy}
        selected={true}
        onPress={onPharmacyPress}
      />,
    );
  }

  return markerNodes;
};
