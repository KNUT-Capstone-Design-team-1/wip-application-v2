import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { Marker, LatLng } from 'react-native-maps';
import { styles } from '@features/nearby_pharmacy/styles/NearbyPharmacyScreen';
import { px } from '@utils/responsive';

interface IPharmacyClusterMarkerProps {
  coordinate: LatLng;
  count: number;
  onPress: () => void;
}

/**
 * 여러 약국 마커를 하나로 묶어 표시하는 클러스터 마커.
 *
 * NOTE: Android 는 SVG/Text 렌더 타이밍이 비트맵 캡처보다 늦어 잘리는 이슈가
 * 있어 `tracksViewChanges` 를 계속 true 로 둔다.
 */
const PharmacyClusterMarker = ({
  coordinate,
  count,
  onPress,
}: IPharmacyClusterMarkerProps) => {
  const size = px(34) + Math.log2(count);

  return (
    <Marker
      coordinate={coordinate}
      onPress={onPress}
      anchor={{ x: 0.5, y: 0.5 }}
      centerOffset={{ x: 0, y: 0 }}
      tracksViewChanges={true}
    >
      <View collapsable={false} style={styles.clusterCaptureFrame}>
        <View
          style={[
            styles.markerWrapper,
            styles.clusterWrapper,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        >
          <Text style={styles.clusterCount}>{count}</Text>
        </View>
      </View>
    </Marker>
  );
};

export default memo(PharmacyClusterMarker);
