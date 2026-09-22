import React, { memo, useState, useEffect, useCallback } from 'react';
import { View, Text } from 'react-native';
import { Marker, LatLng } from 'react-native-maps';
import { px } from '@utils/responsive';
import { styles } from '@features/nearby_pharmacy/styles/PharmacyClusterMarker';
import { IPharmacyClusterMarkerProps } from '@features/nearby_pharmacy/types/pharmacy_map_type';

// 여러 약국 마커를 하나로 묶어 표시하는 클러스터 마커.
const PharmacyClusterMarker = ({
  coordinate,
  count,
  onPress,
}: IPharmacyClusterMarkerProps) => {
  const [tracksViewChanges, setTracksViewChanges] = useState(true);

  // 클러스터 마커 크기
  const size = Math.round(px(32));

  // count가 변경될 때마다 캡처를 활성화하고, 안정화 후 중단하여 비트맵 확보
  useEffect(() => {
    setTracksViewChanges(true);

    let isMounted = true;
    const timer = setTimeout(() => {
      if (isMounted) {
        setTracksViewChanges(false);
      }
    }, 150);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [count]);

  // 마커 뷰 레이아웃 완료 시 트래킹 종료 처리
  const handleLayout = useCallback(() => {
    setTracksViewChanges(false);
  }, []);

  return (
    <Marker
      coordinate={coordinate}
      stopPropagation={true}
      onPress={(e) => {
        e?.stopPropagation?.();
        onPress();
      }}
      anchor={{ x: 0.5, y: 0.5 }}
      centerOffset={{ x: 0, y: 0 }}
      tracksViewChanges={tracksViewChanges}
      zIndex={10}
    >
      <View
        collapsable={false}
        onLayout={handleLayout}
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

// 불필요한 전수 리렌더링을 방지하기 위한 커스텀 비교 함수
export default memo(PharmacyClusterMarker, (prevProps, nextProps) => {
  return (
    prevProps.count === nextProps.count &&
    prevProps.coordinate.latitude === nextProps.coordinate.latitude &&
    prevProps.coordinate.longitude === nextProps.coordinate.longitude
  );
});
