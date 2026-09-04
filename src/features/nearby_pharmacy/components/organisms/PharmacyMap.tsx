import React, { memo } from 'react';
import MapView, { Region } from 'react-native-maps';
import { styles } from '@features/nearby_pharmacy/styles/NearbyPharmacyScreen';
import { bottomTabSize } from '@constants/size';
import PharmacyMarkers from '@features/nearby_pharmacy/components/molecules/PharmacyMarkers';
import { IPharmacyMapProps } from '@features/nearby_pharmacy/types/pharmacy_map_type';

// react-native-maps의 MapView를 감싸고 마커 및 클러스터 렌더링을 담당하는 지도 컴포넌트
const PharmacyMap = ({
  mapRef,
  initialRegion,
  onRegionChangeComplete,
  insets,
  clusters,
  pharmaciesById,
  selectedPharmacyId,
  onPharmacyPress,
  onClusterPress,
}: IPharmacyMapProps) => {
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
      // Android용 확대/축소 제한 (iOS에서는 deprecated 되었지만 Android에서는 사용)
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
      <PharmacyMarkers
        clusters={clusters}
        pharmaciesById={pharmaciesById}
        selectedPharmacyId={selectedPharmacyId}
        onPharmacyPress={onPharmacyPress}
        onClusterPress={onClusterPress}
      />
    </MapView>
  );
};

export default memo(PharmacyMap);
