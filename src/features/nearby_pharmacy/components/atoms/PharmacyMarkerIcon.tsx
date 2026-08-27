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
  const size = selected ? px(54) : px(34);
  const strokeWidth = selected ? 3 : 2;

  return (
    <View style={[styles.container, selected && styles.selectedContainer]}>
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
