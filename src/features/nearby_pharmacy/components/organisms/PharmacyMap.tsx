import React, { RefObject } from 'react';
import MapView, { Region } from 'react-native-maps';
import { EdgeInsets } from 'react-native-safe-area-context';
import { styles } from '@features/nearby_pharmacy/styles/NearbyPharmacyScreen';
import { bottomTabSize } from '@constants/size';
import PharmacyMarkers from '@features/nearby_pharmacy/components/molecules/PharmacyMarkers';
import { INearbyPharmacies } from '@services/database/types';
import { TPharmacyClusterItem } from '@features/nearby_pharmacy/hooks/use_pharmacy_clusters';

interface IPharmacyMapProps {
  mapRef: RefObject<MapView | null>;
  initialRegion: Region;
  onRegionChangeComplete: (region: Region) => void;
  insets: EdgeInsets;
  clusters: TPharmacyClusterItem[];
  pharmaciesById: Map<string, INearbyPharmacies>;
  selectedPharmacyId?: string;
  onPharmacyPress: (pharmacy: INearbyPharmacies) => void;
  onClusterPress: (clusterId: number) => void;
}

// react-native-maps의 MapView를 감싸고, 마커 및 클러스터 렌더링을 담당하는 지도 컴포넌트
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
      onRegionChangeComplete={onRegionChangeComplete} // 지도를 드래그해서 멈출 때마다 좌표 업데이트
      showsUserLocation={true} // 내 위치 파란 점 표시
      showsMyLocationButton={false} // 기본 내 위치 버튼 숨김 (커스텀 버튼 사용)
      toolbarEnabled={false} // 안드로이드 기본 툴바(길찾기 등) 숨김
      userInterfaceStyle="light"
      // Android용 확대/축소 제한 (iOS에서는 deprecated 되었지만 Android에서는 사용)
      minZoomLevel={6}
      maxZoomLevel={19}
      // iOS 13+ 용 확대/축소 제한 (위도/경도 거리가 아닌 고도(미터) 기준)
      cameraZoomRange={{
        minCenterCoordinateDistance: 500, // 최대 확대 (약 zoom 19)
        maxCenterCoordinateDistance: 2000000, // 최대 축소 (약 zoom 6, 2000km)
        animated: true,
      }}
      // 리스트 오버레이가 지도를 가리지 않도록 하단 여백 추가
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

export default PharmacyMap;
