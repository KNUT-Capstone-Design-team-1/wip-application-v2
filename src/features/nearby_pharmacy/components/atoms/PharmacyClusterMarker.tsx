import React, { memo, useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Marker, LatLng } from 'react-native-maps';
import { px } from '@utils/responsive';
import { styles } from '@features/nearby_pharmacy/styles/PharmacyClusterMarker';

interface IPharmacyClusterMarkerProps {
  coordinate: LatLng;
  count: number;
  onPress: () => void;
}

// 여러 약국 마커를 하나로 묶어 표시하는 클러스터 마커.
const PharmacyClusterMarker = ({
  coordinate,
  count,
  onPress,
}: IPharmacyClusterMarkerProps) => {
  const [tracksViewChanges, setTracksViewChanges] = useState(true);

  // 클러스터 마커 크기
  const size = Math.round(px(32));

  // count가 변경될 때마다 캡처를 활성화하고, 일정 시간 후 중단하여 성능 확보
  useEffect(() => {
    setTracksViewChanges(true);

    const timer = setTimeout(() => {
      setTracksViewChanges(false);
    }, 150); // 150ms: 성능과 안정성의 최적 타협점

    return () => clearTimeout(timer);
  }, [count]);

  return (
    <Marker
      coordinate={coordinate}
      onPress={onPress}
      anchor={{ x: 0.5, y: 0.5 }}
      centerOffset={{ x: 0, y: 0 }}
      tracksViewChanges={tracksViewChanges}
    >
      <View
        collapsable={false}
        style={[
          styles.markerWrapper,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        <Text style={styles.clusterCount}>{count}</Text>
      </View>
    </Marker>
  );
};

export default memo(PharmacyClusterMarker);
