import React from 'react';
import { View } from 'react-native';
import PharmacySvg from '@assets/images/pharmacy.svg';
import { px } from '@utils/responsive';
import { styles } from '@features/nearby_pharmacy/styles/NearbyPharmacyScreen';

interface IPharmacyMarkerIconProps {
  selected: boolean;
}

const PharmacyMarkerIcon = ({ selected }: IPharmacyMarkerIconProps) => {
  const size = px(34);
  const iconSize = px(20);

  return (
    <View
      style={[
        styles.markerWrapper,
        selected && styles.markerWrapperSelected,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <PharmacySvg width={iconSize} height={iconSize} />
    </View>
  );
};

export default PharmacyMarkerIcon;
