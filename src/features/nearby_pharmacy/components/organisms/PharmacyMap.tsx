import React, { memo, useMemo } from 'react';
import MapView from 'react-native-maps';
import { styles } from '@features/nearby_pharmacy/styles/NearbyPharmacyScreen';
import { bottomTabSize } from '@constants/size';
import { IPharmacyMapProps } from '@features/nearby_pharmacy/types/pharmacy_map_type';
import {
  filterValidClusterItems,
  getPharmacyCoordinate,
} from '@features/nearby_pharmacy/utils/map_marker';
import { renderPharmacyMarkers } from '@features/nearby_pharmacy/components/organisms/render_pharmacy_markers';

// MapView를 감싸고 지도 뷰포트 및 렌더링을 담당하는 컴포넌트
const PharmacyMap = ({
  mapRef,
  initialRegion,
  onRegionChangeComplete,
  insets,
  clusters,
  pharmaciesById,
  selectedPharmacy,
  getClusterPharmacyIds,
  onPharmacyPress,
  onClusterPress,
}: IPharmacyMapProps) => {
  // 렌더링 전 유효한 마커 필터링
  const validItems = useMemo(
    () => filterValidClusterItems(clusters, pharmaciesById),
    [clusters, pharmaciesById],
  );

  // 선택된 약국의 좌표 계산 및 검증
  const selectedCoordinate = useMemo(
    () => getPharmacyCoordinate(selectedPharmacy),
    [selectedPharmacy],
  );

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={initialRegion}
      onRegionChangeComplete={onRegionChangeComplete}
      showsUserLocation={true}
      showsMyLocationButton={false}
      toolbarEnabled={false}
      userInterfaceStyle="light"
      minZoomLevel={6}
      maxZoomLevel={19}
      cameraZoomRange={{
        minCenterCoordinateDistance: 500,
        maxCenterCoordinateDistance: 2000000,
        animated: true,
      }}
      mapPadding={{
        top: 0,
        bottom: bottomTabSize.height + insets.bottom,
        left: 0,
        right: 0,
      }}
    >
      {/* Fabric New Architecture 직속 자식 마커 렌더링 */}
      {renderPharmacyMarkers({
        validItems,
        pharmaciesById,
        selectedPharmacy,
        selectedCoordinate,
        getClusterPharmacyIds,
        onPharmacyPress,
        onClusterPress,
      })}
    </MapView>
  );
};

export default memo(PharmacyMap);
