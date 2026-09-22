import React, { memo, useState, useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import { Marker, MapMarker } from 'react-native-maps';
import { styles } from '@features/nearby_pharmacy/styles/PharmacyClusterMarker';
import { IPharmacyClusterMarkerProps } from '@features/nearby_pharmacy/types/pharmacy_map_type';
import {
  MARKER_CLUSTER_SIZE,
  MARKER_ANCHOR_UNSELECTED,
  MARKER_TRACKS_CHANGES_TIMEOUT_MS,
} from '@features/nearby_pharmacy/constants/map';

// 클러스터 마커 컴포넌트
const PharmacyClusterMarker = ({
  coordinate,
  count,
  onPress,
}: IPharmacyClusterMarkerProps) => {
  const markerRef = useRef<MapMarker>(null);
  const [tracksViewChanges, setTracksViewChanges] = useState(true);

  // count 변경 시 스냅샷 재캡처
  useEffect(() => {
    setTracksViewChanges(true);
    markerRef.current?.redraw();

    const timer = setTimeout(() => {
      markerRef.current?.redraw();
      setTracksViewChanges(false);
    }, MARKER_TRACKS_CHANGES_TIMEOUT_MS);

    return () => clearTimeout(timer);
  }, [count]);

  return (
    <Marker
      ref={markerRef}
      coordinate={coordinate}
      stopPropagation={true}
      onPress={(e) => {
        e?.stopPropagation?.();
        onPress();
      }}
      anchor={MARKER_ANCHOR_UNSELECTED}
      centerOffset={{ x: 0, y: 0 }}
      tracksViewChanges={tracksViewChanges}
      zIndex={10}
    >
      <View
        collapsable={false}
        style={[
          styles.markerWrapper,
          {
            width: MARKER_CLUSTER_SIZE,
            height: MARKER_CLUSTER_SIZE,
            borderRadius: MARKER_CLUSTER_SIZE / 2,
          },
        ]}
      >
        <Text style={styles.clusterCount}>{count}</Text>
      </View>
    </Marker>
  );
};

export default memo(PharmacyClusterMarker);
