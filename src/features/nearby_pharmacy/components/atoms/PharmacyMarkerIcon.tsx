import React from 'react';
import { View } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { COLOR } from '@constants/color';
import { px } from '@utils/responsive';

interface IPharmacyMarkerIconProps {
  selected: boolean;
}

const PharmacyMarkerIcon = ({ selected }: IPharmacyMarkerIconProps) => {
  const size = selected ? px(46) : px(34);

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <MapPin size={size} color={COLOR['white']} fill={COLOR['marker']} />
    </View>
  );
};

export default PharmacyMarkerIcon;
