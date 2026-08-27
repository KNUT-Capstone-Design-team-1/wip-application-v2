import React, { memo, useState, useEffect, useCallback } from 'react';
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
 * NOTE: Android 캡처 잘림 방지를 위해 외부 래퍼에 여유 공간(Padding)을 둡니다.
 */
const PharmacyClusterMarker = ({
  coordinate,
  count,
  onPress,
}: IPharmacyClusterMarkerProps) => {
  const [tracksViewChanges, setTracksViewChanges] = useState(true);

  // 클러스터 마커 크기
  const size = Math.round(px(32));
  // 캡처 영역 확보를 위한 외부 래퍼 크기 (상하좌우 여유 확보)
  const wrapperSize = size + Math.round(px(8));

  // 렌더링이 완료된 후 비트맵 캡처를 중단하여 성능을 확보
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (tracksViewChanges) {
      timer = setTimeout(() => {
        setTracksViewChanges(false);
      }, 100);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [tracksViewChanges]);

  // count가 변경되면 다시 캡처하도록 유도
  useEffect(() => {
    setTracksViewChanges(true);
  }, [count]);

  return (
    <Marker
      coordinate={coordinate}
      onPress={onPress}
      anchor={{ x: 0.5, y: 0.5 }}
      centerOffset={{ x: 0, y: 0 }}
      tracksViewChanges={tracksViewChanges}
    >
      <View collapsable={false}>
        <View
          style={[
            styles.outerWrapper,
            { width: wrapperSize, height: wrapperSize },
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
      </View>
    </Marker>
  );
};

export default memo(PharmacyClusterMarker);
