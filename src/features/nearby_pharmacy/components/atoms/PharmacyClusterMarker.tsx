import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { Marker, LatLng } from 'react-native-maps';
import { px } from '@utils/responsive';
import { styles } from '@features/nearby_pharmacy/styles/PharmacyClusterMarker';

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
  const frameSize = size + px(24); // 충분한 여백 확보 (그림자 등)

  return (
    <Marker
      coordinate={coordinate}
      onPress={onPress}
      anchor={{ x: 0.5, y: 0.5 }}
      centerOffset={{ x: 0, y: 0 }}
      tracksViewChanges={true}
    >
      <View
        collapsable={false}
        style={[
          styles.clusterCaptureFrame,
          {
            width: frameSize,
            height: frameSize,
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
      >
        <View
          style={[
            styles.markerWrapper,
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
