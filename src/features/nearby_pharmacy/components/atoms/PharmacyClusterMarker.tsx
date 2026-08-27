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
  // 소수점 픽셀로 인한 캡처 잘림 방지
  const size = Math.round(px(34) + Math.log2(count));
  const padding = Math.round(px(16));
  const frameSize = size + padding * 2;

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
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        {/* Android 마커 캡처용 가짜 그림자 (소프트웨어 캔버스에서 elevation이 잘리는 현상 우회) */}
        <View
          style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            top: (frameSize - size) / 2 + px(2), // y축 그림자 오프셋
          }}
        />
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
