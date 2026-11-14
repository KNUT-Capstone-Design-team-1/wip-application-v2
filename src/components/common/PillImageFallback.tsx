import { StyleSheet, View } from 'react-native';
import Svg, { G, Line, Rect } from 'react-native-svg';
import { COLOR, COLOR_BG, COLOR_TEXT } from '@constants/color';
import { fontPx, px } from '@utils/responsive';
import { BaseText } from './BaseText';

export default function PillImageFallback() {
  return (
    <View style={styles.container} accessible accessibilityLabel="이미지 없음">
      <Svg
        width="70%"
        height="50%"
        viewBox="0 0 100 100"
        style={styles.icon}
        accessible={false}
      >
        <G rotation={-35} origin="50, 50">
          <Rect
            x={15}
            y={32}
            width={70}
            height={36}
            rx={18}
            fill={COLOR_BG.surface}
            stroke={COLOR.primary}
            strokeWidth={2.5}
          />
          <Line
            x1={50}
            y1={33}
            x2={50}
            y2={67}
            stroke={COLOR.primary}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <BaseText
        size={10}
        weight="regular"
        style={styles.label}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.5}
      >
        이미지 없음
      </BaseText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: px(2),
    gap: px(2),
  },
  icon: {
    flexShrink: 1,
    maxWidth: px(100),
    maxHeight: px(100),
  },
  label: {
    color: COLOR_TEXT.sub,
    textAlign: 'center',
    lineHeight: fontPx(12),
    maxWidth: '90%',
    flexShrink: 1,
  },
});
