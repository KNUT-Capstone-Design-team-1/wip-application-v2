import { font, os } from '@/style/font'
import { memo } from 'react'
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native'

type TCustomChip = {
  text: string
  style?: ViewStyle
  textStyle?: TextStyle
}

const CustomChip = ({ text, style, textStyle }: TCustomChip): JSX.Element => {
  return (
    <View style={[styles.chipTextWrapper, style]}>
      <Text style={[styles.chipText, textStyle]}>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  chipTextWrapper: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#858585',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  chipText: {
    color: '#000',
    fontSize: font(12),
    fontFamily: os.font(500, 500),
    includeFontPadding: false,
    paddingTop: 0,
    paddingBottom: 1,
    paddingHorizontal: 8,
  }
})

export default memo(CustomChip)