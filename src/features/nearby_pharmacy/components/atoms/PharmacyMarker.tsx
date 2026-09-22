import React, { memo, useEffect, useState, useCallback, useRef } from 'react';
import { View } from 'react-native';
import { Marker, MapMarker } from 'react-native-maps';
import PharmacyMarkerIcon from '@features/nearby_pharmacy/components/atoms/PharmacyMarkerIcon';
import { IPharmacyMarkerProps } from '@features/nearby_pharmacy/types/pharmacy_map_type';

// 미선택/선택 상태별 앵커 상수 (원형 도트 중앙: 0.5, 0.5 / 핀 아이콘 하단 끝: 0.5, 1.0)
const UNSELECTED_ANCHOR = { x: 0.5, y: 0.5 };
const SELECTED_ANCHOR = { x: 0.5, y: 1.0 };

/**
 * 개별 약국 마커
 *
 * NOTE: custom Marker View는 플랫폼 네이티브 지도에서 bitmap snapshot으로
 * 렌더링된다. 마커를 언마운트하지 않고 상태를 교체할 때 네이티브 bitmap을
 * 즉시 갱신(redraw)하여 마커 깜빡임(flicker)과 잔상(stale)을 동시에 방지한다.
 */
const PharmacyMarker = ({
  coordinate,
  pharmacy,
  selected,
  onPress,
}: IPharmacyMarkerProps) => {
  const markerRef = useRef<MapMarker>(null);
  const [tracksViewChanges, setTracksViewChanges] = useState(true);

  useEffect(() => {
    // 선택 상태 변경 시 뷰 변경 추적 활성화
    setTracksViewChanges(true);

    // 뷰 레이아웃 변경 직후 네이티브 비트맵을 즉시 다시 그려 깜빡임 없이 아이콘 교체
    const frame1 = setTimeout(() => {
      markerRef.current?.redraw();
    }, 16);

    // 스냅샷 안정화 후 CPU 점유를 막기 위해 추적 신속 종료 (빠른 교차 탭 지원)
    const finishTimer = setTimeout(() => {
      markerRef.current?.redraw();
      setTracksViewChanges(false);
    }, 120);

    return () => {
      clearTimeout(frame1);
      clearTimeout(finishTimer);
    };
  }, [selected]);

  // 마커 뷰 레이아웃 완료 시 안정적인 스냅샷 갱신 처리
  const handleLayout = useCallback(() => {
    setTracksViewChanges(true);

    const timer = setTimeout(() => {
      markerRef.current?.redraw();
      setTracksViewChanges(false);
    }, 120);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Marker
      ref={markerRef}
      coordinate={coordinate}
      stopPropagation={true}
      onPress={(e) => {
        e?.stopPropagation?.();
        onPress(pharmacy);
      }}
      tracksViewChanges={tracksViewChanges}
      anchor={selected ? SELECTED_ANCHOR : UNSELECTED_ANCHOR}
      centerOffset={{ x: 0, y: 0 }}
      zIndex={1}
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
