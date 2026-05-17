import React from 'react';
import { Text } from 'react-native';
import TouchableScale from 'react-native-touchable-scale';
import { COLOR_PRIMARY } from '@constants/color';
import { styles } from '../../styles/atoms/Button';

interface IButtonProps {
  background?: string;
  color?: string;
  width?: string | number;
  label: string;
  pressHandler: () => void;
}

const Button = ({
  background = COLOR_PRIMARY[100],
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
      <Text style={[styles.label, { color: color }]}>{label}</Text>
    </TouchableScale>
  );
};

export default Button;
