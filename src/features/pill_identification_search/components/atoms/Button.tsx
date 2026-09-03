import React from 'react';
import { BaseText } from '@components/common/BaseText';
import TouchableScale from 'react-native-touchable-scale';
import { COLOR } from '@constants/color';
import { IButtonProps } from '@features/pill_identification_search/types';
import { styles } from '../../styles/atoms/Button';

// 식별 검색 공용 버튼 컴포넌트 (Atom)
const Button = ({
  background = COLOR['primary'],
  color = '#fff',
  width = '50%',
  label,
  pressHandler,
}: IButtonProps) => {
  return (
    <TouchableScale
      activeScale={0.95}
      pressInTension={150}
      pressInFriction={150}
      pressOutTension={0}
      onPress={pressHandler}
      style={[styles.button, { width: width, backgroundColor: background }]}
    >
      <BaseText
        style={[styles.label, { color: color }]}
        size={18}
        weight="bold"
      >
        {label}
      </BaseText>
    </TouchableScale>
  );
};

export default Button;
