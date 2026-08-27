import React from 'react';
import { View } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { COLOR } from '@constants/color';
import { px } from '@utils/responsive';

interface IPharmacyMarkerIconProps {
  selected: boolean;
}

const PharmacyMarkerIcon = ({ selected }: IPharmacyMarkerIconProps) => {
  const size = Math.round(px(34));
  const strokeWidth = 2;

  return (
    <View>
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
