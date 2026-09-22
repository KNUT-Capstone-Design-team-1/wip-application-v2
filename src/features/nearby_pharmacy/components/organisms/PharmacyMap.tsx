import React, { memo } from 'react';
import MapView from 'react-native-maps';
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
  getClusterPharmacyIds,
  isOpenOnly,
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
      {/*
       * isOpenOnly가 변경될 때 key가 바뀌어 PharmacyMarkers 전체를 언마운트/재마운트한다.
       * React Native Maps 네이티브 마커 레이어가 tracksViewChanges=false 상태에서
       * 언마운트 신호를 즉시 반영하지 못하는 플랫폼 버그를 완전히 우회하는 방법이다.
       */}
      <PharmacyMarkers
        key={`markers-${String(isOpenOnly)}`}
        clusters={clusters}
        pharmaciesById={pharmaciesById}
        selectedPharmacyId={selectedPharmacyId}
        getClusterPharmacyIds={getClusterPharmacyIds}
        onPharmacyPress={onPharmacyPress}
        onClusterPress={onClusterPress}
      />
    </MapView>
  );
};

export default memo(PharmacyMap);
