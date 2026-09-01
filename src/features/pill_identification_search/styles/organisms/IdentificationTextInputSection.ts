import { COLOR, COLOR_TEXT } from '@constants/color';
import { StyleSheet } from 'react-native';
import { px, fontPx } from '@utils/responsive';

export const styles = StyleSheet.create({
  container: {
    marginBottom: px(2),
    backgroundColor: COLOR['white'],
    paddingHorizontal: px(20),
  },
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
    borderColor: COLOR['primary'],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: px(8),
  },
  textInputLabelCheckboxText: {
    color: COLOR['white'],
  },
  textInputLabelText: {
    color: COLOR_TEXT['label'],
    paddingVertical: px(0),
    includeFontPadding: false,
    textAlignVertical: 'center',
    lineHeight: fontPx(18),
    transform: [{ translateY: px(-1.5) }],
  },
  inputContainer: {
    flexDirection: 'row',
    gap: px(8),
    alignItems: 'center',
    marginBottom: px(8),
  },
  flex1: { flex: 1 },
});
