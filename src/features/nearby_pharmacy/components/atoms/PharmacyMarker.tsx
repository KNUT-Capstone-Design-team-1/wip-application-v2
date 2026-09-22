import React, { memo, useCallback } from 'react';
import { Marker } from 'react-native-maps';
import { IPharmacyMarkerProps } from '@features/nearby_pharmacy/types/pharmacy_map_type';

// 네이티브 이미지 마커 애셋 (정적 비트맵으로 렌더링되어 뷰 스냅샷 오버헤드와 깜빡임 완전 제거)
const PHARMACY_MARKER_IMAGE = require('@assets/images/pharmacy_marker.png');

// 미선택 상태 앵커 상수 (원형 도트 중앙: 0.5, 0.5)
const UNSELECTED_ANCHOR = { x: 0.5, y: 0.5 };

/**
 * 개별 약국 네이티브 이미지 마커
 *
 * NOTE: 개별 약국은 네이티브 image prop을 사용하는 단일 마커로 렌더링하여 뷰 계층 렌더링 비용을 0으로 만듭니다.
 * 선택된 약국은 최상단 전용 오버레이 마커(SelectedPharmacyMarker)가 별도로 렌더링하므로,
 * 개별 마커는 미선택 상태일 때만 네이티브 비트맵으로 표시됩니다.
 */
const PharmacyMarker = ({
  coordinate,
  pharmacy,
  selected,
  onPress,
}: IPharmacyMarkerProps) => {
  const handlePress = useCallback(() => {
    onPress(pharmacy);
  }, [onPress, pharmacy]);

  // 선택된 상태에서는 상단 SelectedPharmacyMarker가 렌더링되므로 이미지 마커는 렌더링하지 않음
  if (selected) {
    return null;
  }

  return (
    <Marker
      coordinate={coordinate}
      image={PHARMACY_MARKER_IMAGE}
      anchor={UNSELECTED_ANCHOR}
      zIndex={1}
      tracksViewChanges={false}
      stopPropagation={true}
      onPress={handlePress}
    />
  );
};

// 불필요한 전수 리렌더링을 방지하기 위한 커스텀 비교 함수
export default memo(PharmacyMarker, (prevProps, nextProps) => {
  return (
    prevProps.selected === nextProps.selected &&
    prevProps.pharmacy.id === nextProps.pharmacy.id &&
    prevProps.coordinate.latitude === nextProps.coordinate.latitude &&
    prevProps.coordinate.longitude === nextProps.coordinate.longitude
  );
});
