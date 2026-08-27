import React from 'react';
import { View } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { COLOR } from '@constants/color';
import { px } from '@utils/responsive';
import { styles } from '@features/nearby_pharmacy/styles/PharmacyMarkerIcon';

interface IPharmacyMarkerIconProps {
  selected: boolean;
}

const PharmacyMarkerIcon = ({ selected }: IPharmacyMarkerIconProps) => {
  // 소수점 픽셀로 인한 Android 캔버스 캡처 오류 방지
  const size = Math.round(selected ? px(54) : px(34));
  const strokeWidth = selected ? 3 : 2;

  return (
    <View
      style={[
        styles.container,
        selected && styles.selectedContainer,
        { width: size, height: size },
      ]}
    >
      <MapPin
        size={size}
        color={COLOR['white']}
        fill={selected ? COLOR['markerSelected'] : COLOR['marker']}
        strokeWidth={strokeWidth}
      />
    </View>
  );
};

export default PharmacyMarkerIcon;
