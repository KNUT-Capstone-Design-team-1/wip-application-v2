import { font, os } from '@/style/font';
import { TCustomChip } from '@/types/atoms/type';
import { memo } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

const CustomChip = ({
  text,
  style,
  textStyle,
}: TCustomChip): React.JSX.Element => {
  return (
    <View style={[styles.chipTextWrapper, style]}>
      <Text style={[styles.chipText, textStyle]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chipText: {
    color: '#000',
    fontFamily: os.font(500, 500),
    fontSize: font(12),
    includeFontPadding: false,
    paddingBottom: 1,
    paddingHorizontal: 8,
    paddingTop: 0,
  },
  chipTextWrapper: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#858585',
    borderRadius: 4,
    borderWidth: 0.5,
    justifyContent: 'center',
  },
});

export default memo(CustomChip);
