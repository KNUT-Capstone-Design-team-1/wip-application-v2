import React, { memo } from 'react';
import { Marker, LatLng } from 'react-native-maps';

// 선택된 핀 네이티브 이미지 마커 애셋
const PHARMACY_MARKER_SELECTED_IMAGE = require('@assets/images/pharmacy_marker_selected.png');

// 선택된 핀 마커의 앵커 상수 (핀 아이콘 하단 끝: 0.5, 1.0)
const SELECTED_ANCHOR = { x: 0.5, y: 1.0 };

interface ISelectedPharmacyMarkerProps {
  coordinate: LatLng;
  onPress: () => void;
}

/**
 * 선택된 약국 전용 네이티브 이미지 오버레이 마커
 *
 * NOTE: 자식 View 없이 네이티브 image prop을 사용하여
 * 렌더링 비용과 스냅샷 지연을 완전히 제거하고 즉각적으로 반응합니다.
 */
const SelectedPharmacyMarker = ({
  coordinate,
  onPress,
}: ISelectedPharmacyMarkerProps) => {
  return (
    <Marker
      coordinate={coordinate}
      image={PHARMACY_MARKER_SELECTED_IMAGE}
      anchor={SELECTED_ANCHOR}
      zIndex={999}
      tracksViewChanges={false}
      stopPropagation={true}
      onPress={(e) => {
        e?.stopPropagation?.();
        onPress();
      }}
    />
  );
};

export default memo(SelectedPharmacyMarker);
