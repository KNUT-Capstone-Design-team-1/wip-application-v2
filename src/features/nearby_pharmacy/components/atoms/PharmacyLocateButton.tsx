import React from 'react';
import { Pressable } from 'react-native';
import { LocateFixed } from 'lucide-react-native';
import { EdgeInsets } from 'react-native-safe-area-context';
import { px } from '@utils/responsive';
import { bottomTabSize } from '@constants/size';
import { COLOR } from '@constants/color';

interface IPharmacyLocateButtonProps {
  onPress: () => void;
  insets: EdgeInsets;
}

const PharmacyLocateButton = ({
  onPress,
  insets,
}: IPharmacyLocateButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          position: 'absolute',
          bottom: bottomTabSize.height + insets.bottom,
          right: px(8),
          backgroundColor: 'rgba(255,255,255,0.8)',
          padding: px(8),
          borderRadius: px(13),
          opacity: pressed ? 0.5 : 1,
          zIndex: 990,
        },
      ]}
    >
      <LocateFixed size={px(32)} color={COLOR['secondary']} strokeWidth={2} />
    </Pressable>
  );
};

export default PharmacyLocateButton;
