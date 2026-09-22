import React, { memo, useEffect, useState, useCallback } from 'react';
import { View } from 'react-native';
import { Marker } from 'react-native-maps';
import PharmacyMarkerIcon from '@features/nearby_pharmacy/components/atoms/PharmacyMarkerIcon';
import { IPharmacyMarkerProps } from '@features/nearby_pharmacy/types/pharmacy_map_type';

// 미선택/선택 상태별 앵커 상수 (원형 도트 중앙: 0.5, 0.5 / 핀 아이콘 하단 끝: 0.5, 1.0)
const UNSELECTED_ANCHOR = { x: 0.5, y: 0.5 };
const SELECTED_ANCHOR = { x: 0.5, y: 1.0 };

/**
 * 개별 약국 마커
 *
 * NOTE: custom Marker View는 플랫폼 네이티브 지도에서 bitmap snapshot으로
 * 렌더링된다. `tracksViewChanges`를 계속 true로 두면 iOS에서 지도 이동 중
 * snapshot이 반복되어 CPU/메모리 사용량이 급증할 수 있으므로 초기 표시와
 * 선택 상태 변경 시에만 잠시 활성화한다.
 */
const PharmacyMarker = ({
  coordinate,
  pharmacy,
  selected,
  onPress,
}: IPharmacyMarkerProps) => {
  /**
   * iOS MapKit은 custom Marker View를 `tracksViewChanges=true` 상태로
   * 계속 snapshot 하면 지도 이동 중 snapshot이 폭증하여 메모리/렌더링
   * 문제가 발생할 수 있다. 마커가 처음 표시되거나 선택 상태가 바뀔 때만
   * 잠시 snapshot을 허용하고 이후에는 정지시킨다.
   * 안전한 비트맵 캡처를 위해 충분한 시간(500ms) 동안 활성화한다.
   */
  const [tracksViewChanges, setTracksViewChanges] = useState(true);

  useEffect(() => {
    setTracksViewChanges(true);

    let isMounted = true;
    const timer = setTimeout(() => {
      if (isMounted) {
        setTracksViewChanges(false);
      }
    }, 500);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [selected]);

  // 마커 뷰 레이아웃 완료 시 안정적인 스냅샷 갱신 처리
  const handleLayout = useCallback(() => {
    setTracksViewChanges(true);

    const timer = setTimeout(() => {
      setTracksViewChanges(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Marker
      coordinate={coordinate}
      stopPropagation={true}
      onPress={(e) => {
        e?.stopPropagation?.();
        onPress(pharmacy);
      }}
      tracksViewChanges={tracksViewChanges}
      anchor={selected ? SELECTED_ANCHOR : UNSELECTED_ANCHOR}
      centerOffset={{ x: 0, y: 0 }}
      zIndex={selected ? 10 : 0}
    >
      <View collapsable={false} onLayout={handleLayout}>
        <PharmacyMarkerIcon selected={selected} />
      </View>
    </Marker>
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
