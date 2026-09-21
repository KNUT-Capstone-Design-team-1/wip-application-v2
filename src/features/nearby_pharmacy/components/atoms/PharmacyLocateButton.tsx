import React, { memo } from 'react';
import { Pressable } from 'react-native';
import { LocateFixed } from 'lucide-react-native';
import { px } from '@utils/responsive';
import { COLOR } from '@constants/color';
import { IPharmacyLocateButtonProps } from '@features/nearby_pharmacy/types/pharmacy_ui_type';

// 지도 카메라를 사용자 현재 위치로 이동시키는 플로팅 버튼
const PharmacyLocateButton = ({ onPress }: IPharmacyLocateButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: 'rgba(255,255,255,0.95)',
          padding: px(8),
          borderRadius: px(13),
          opacity: pressed ? 0.5 : 1,
          elevation: 4,
          shadowColor: COLOR.shadow,
          shadowOffset: { width: 0, height: px(2) },
          shadowOpacity: 0.15,
          shadowRadius: px(4),
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}
    >
      <LocateFixed size={px(22)} color={COLOR['secondary']} strokeWidth={2} />
    </Pressable>
  );
};

export default memo(PharmacyLocateButton);
