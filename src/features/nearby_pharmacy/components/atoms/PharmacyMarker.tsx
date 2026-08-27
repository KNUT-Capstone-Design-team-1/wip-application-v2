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
  const iconSize = selected ? px(54) : px(34);
  const frameSize = iconSize + px(24); // 충분한 여백 확보 (그림자 등)

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
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
      >
        <PharmacyMarkerIcon selected={selected} />
      </View>
    </Marker>
  );
};

export default memo(PharmacyMarker);
