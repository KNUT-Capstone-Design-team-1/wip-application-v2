import React, { memo } from 'react';
import { View } from 'react-native';
import { Marker, LatLng } from 'react-native-maps';
import { INearbyPharmacies } from '@services/database/types';
import PharmacyMarkerIcon from '@features/nearby_pharmacy/components/atoms/PharmacyMarkerIcon';
import { styles } from '@features/nearby_pharmacy/styles/PharmacyMarker';
import { px } from '@utils/responsive';

interface IPharmacyMarkerProps {
  coordinate: LatLng;
  pharmacy: INearbyPharmacies;
  selected: boolean;
  onPress: (pharmacy: INearbyPharmacies) => void;
}

/**
 * 개별 약국 마커
 *
 * NOTE: Android 에서 react-native-svg 아이콘은 `<Marker>` 의 비트맵 캡처
 * 타이밍보다 늦게 렌더되어 잘려 보이는 이슈가 있어 `tracksViewChanges` 를
 * 계속 true 로 둔다. memo 되어 props 변화 없으면 재캡처 부하는 미미함.
 */
const PharmacyMarker = ({
  coordinate,
  pharmacy,
  selected,
  onPress,
}: IPharmacyMarkerProps) => {
  // 소수점 픽셀로 인한 Android 캔버스 캡처 오류 방지를 위해 Math.round 사용
  // Android 마커 잘림 현상 방지를 위해 wrapper에 명시적인 크기를 지정합니다.
  const iconSize = Math.round(selected ? px(54) : px(34));
  const padding = Math.round(px(16));
  const frameSize = iconSize + padding * 2;

  return (
    <Marker
      coordinate={coordinate}
      onPress={() => onPress(pharmacy)}
      tracksViewChanges={true}
      anchor={{ x: 0.5, y: 0.5 }}
      centerOffset={{ x: 0, y: 0 }}
    >
      <View
        collapsable={false}
        style={[
          styles.markerCaptureFrame,
          {
            width: frameSize,
            height: frameSize,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <PharmacyMarkerIcon selected={selected} />
      </View>
    </Marker>
  );
};

export default memo(PharmacyMarker);
