import React, { memo } from 'react';
import { Marker } from 'react-native-maps';
import { IPharmacyMarkerProps } from '@features/nearby_pharmacy/types/pharmacy_map_type';
import {
  MARKER_ANCHOR_SELECTED,
  MARKER_ANCHOR_UNSELECTED,
  MARKER_Z_INDEX_SELECTED,
  MARKER_Z_INDEX_UNSELECTED,
  MARKER_SELECTED_IMAGE,
  MARKER_UNSELECTED_IMAGE,
} from '@features/nearby_pharmacy/constants/map';

// 개별 약국 마커 컴포넌트 (정적 이미지 마커 적용으로 깜빡임 및 기본 빨간 핀 노출 방지)
const PharmacyMarker = ({
  coordinate,
  pharmacy,
  selected,
  onPress,
}: IPharmacyMarkerProps) => {
  return (
    <Marker
      coordinate={coordinate}
      stopPropagation={true}
      onPress={(e) => {
        e?.stopPropagation?.();
        onPress(pharmacy);
      }}
      image={selected ? MARKER_SELECTED_IMAGE : MARKER_UNSELECTED_IMAGE}
      tracksViewChanges={false}
      anchor={selected ? MARKER_ANCHOR_SELECTED : MARKER_ANCHOR_UNSELECTED}
      centerOffset={{ x: 0, y: 0 }}
      zIndex={selected ? MARKER_Z_INDEX_SELECTED : MARKER_Z_INDEX_UNSELECTED}
    />
  );
};

export default memo(PharmacyMarker);
