import React from 'react';
import { View } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { COLOR } from '@constants/color';
import {
  styles,
  getSelectedIconSize,
} from '@features/nearby_pharmacy/styles/PharmacyMarkerIcon';

interface IPharmacyMarkerIconProps {
  selected: boolean;
}

// 개별 약국 마커의 아이콘(선택 여부에 따라 디자인 변경)을 렌더링하는 컴포넌트
const PharmacyMarkerIcon = ({ selected }: IPharmacyMarkerIconProps) => {
  const isUnselected = !selected;

  if (isUnselected) {
    return (
      <View style={styles.unselectedOuter}>
        <View style={styles.unselectedMiddle}>
          <View style={styles.unselectedInner} />
        </View>
      </View>
    );
  }

  const iconSize = getSelectedIconSize();
  const strokeWidth = 2;

  return (
    <View style={styles.selectedContainer}>
      <View style={styles.selectedHole} />
      <MapPin
        size={iconSize}
        color={COLOR['white']}
        fill={COLOR['marker']}
        strokeWidth={strokeWidth}
      />
    </View>
  );
};

export default PharmacyMarkerIcon;
