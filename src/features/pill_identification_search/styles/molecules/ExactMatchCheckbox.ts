import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';
import { COLOR, COLOR_TEXT } from '@constants/color';

// 식별 문자 완전 일치 체크박스 스타일
export const styles = StyleSheet.create({
  textInputLabelCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: px(10),
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
    color: COLOR_TEXT['white'],
    lineHeight: px(14),
  },
  textInputLabelText: {
    color: COLOR_TEXT['sub'],
  },
});
