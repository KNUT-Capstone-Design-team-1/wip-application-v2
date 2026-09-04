import React, { memo, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Marker } from 'react-native-maps';
import PharmacyMarkerIcon from '@features/nearby_pharmacy/components/atoms/PharmacyMarkerIcon';
import { IPharmacyMarkerProps } from '@features/nearby_pharmacy/types/pharmacy_map_type';

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
  // iOS MapKit은 custom Marker View를 `tracksViewChanges=true` 상태로
  // 계속 snapshot 하면 지도 이동 중 snapshot이 폭증하여 메모리/렌더링
  // 문제가 발생할 수 있다. 마커가 처음 표시되거나 선택 상태가 바뀔 때만
  // 잠시 snapshot을 허용하고 이후에는 정지시킨다.
  const [tracksViewChanges, setTracksViewChanges] = useState(true);

  useEffect(() => {
    setTracksViewChanges(true);

    const timer = setTimeout(() => {
      setTracksViewChanges(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [selected]);

  return (
    <Marker
      coordinate={coordinate}
      onPress={() => onPress(pharmacy)}
      tracksViewChanges={tracksViewChanges}
      anchor={{ x: 0.5, y: 0.5 }}
      centerOffset={{ x: 0, y: 0 }}
      zIndex={selected ? 1 : 0}
    >
      <View collapsable={false}>
        <PharmacyMarkerIcon selected={selected} />
      </View>
    </Marker>
  );
};

export default memo(PharmacyMarker);
