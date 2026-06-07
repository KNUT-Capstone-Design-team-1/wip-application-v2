import { COLOR_PRIMARY } from '@constants/color';
import { StyleSheet } from 'react-native';
import { px, fontPx } from '@utils/responsive';

export const styles = StyleSheet.create({
  textInputColumnWrapper: {
    flexDirection: 'column',
    gap: px(10),
    width: '100%',
  },
  textInputRowWrapper: {
    flexDirection: 'row',
    gap: px(10),
    width: '100%',
  },
  textInputLabelCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: px(5),
  },
  textInputLabelCheckboxWrapper: {
    width: px(18),
    height: px(18),
    borderRadius: px(4),
    borderWidth: 1.5,
    borderColor: COLOR_PRIMARY[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: px(8),
  },
  textInputLabelCheckboxText: {
    color: '#fff',
    fontSize: fontPx(12),
    fontWeight: 700,
  },
  textInputLabelText: {
    fontFamily: 'Paperlogy',
    fontWeight: 400,
    fontSize: fontPx(14),
    color: '#666',
    paddingVertical: px(0),
    includeFontPadding: false,
    textAlignVertical: 'center',
    lineHeight: fontPx(18),
    transform: [{ translateY: px(-1.5) }],
  },
});
