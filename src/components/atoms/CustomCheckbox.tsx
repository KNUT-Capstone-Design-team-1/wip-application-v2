import { os, font } from '@/style/font';
import { useState } from 'react';
import {
  Animated,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface CheckboxProps {
  size?: number;
  fillColor?: string;
  unFillColor?: string;
  style?: ViewStyle;
  boxStyle?: ViewStyle;
  text?: string;
  textStyle?: TextStyle;
  onPress?: (isChecked: boolean) => void;
}

const CustomCheckbox = ({
  size = 24,
  fillColor = '#000',
  unFillColor = 'transparent',
  style,
  boxStyle,
  text = '',
  textStyle,
  onPress,
}: CheckboxProps): JSX.Element => {
  const [isChecked, setIsChecked] = useState(false);
  const scaleValue = new Animated.Value(1);

  const animateBounce = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = () => {
    setIsChecked(!isChecked);
    animateBounce();
    if (onPress) {
      onPress(!isChecked);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        style,
        { flexDirection: text ? 'row' : 'column' },
      ]}
      onPress={handlePress}
      activeOpacity={0.6}
    >
      <Animated.View
        style={[
          styles.checkbox,
          {
            width: size,
            height: size,
            backgroundColor: isChecked ? fillColor : unFillColor,
            transform: [{ scale: scaleValue }],
          },
          boxStyle,
        ]}
      >
        {isChecked && (
          <View
            style={[
              styles.checkmark,
              { width: size * 0.2, height: size * 0.2 },
            ]}
          />
        )}
      </Animated.View>
      {text ? <Text style={[styles.label, textStyle]}>{text}</Text> : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    alignItems: 'center',
    borderColor: 'gray',
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
  },
  checkmark: { backgroundColor: 'white', borderRadius: 2 },
  container: { alignItems: 'center', justifyContent: 'center' },
  label: {
    color: '#000',
    fontFamily: os.font(500, 500),
    fontSize: font(16),
    includeFontPadding: false,
    marginLeft: 8,
    textAlign: 'center',
  },
});

export default CustomCheckbox;
