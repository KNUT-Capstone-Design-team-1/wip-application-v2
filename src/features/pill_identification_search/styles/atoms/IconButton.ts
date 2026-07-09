import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';
import { COLOR_LINE, COLOR_TEXT } from '@constants/color';

export const styles = StyleSheet.create({
  iconButtonWrapper: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
    borderRadius: px(15),
    borderWidth: px(1.5),
    borderColor: COLOR_LINE['border'],
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  iconButtonTop: {
    width: '100%',
    height: '70%',
    borderBottomWidth: px(1.5),
    borderBottomColor: COLOR_LINE['border'],
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: '50%',
    height: '50%',
  },
  iconButtonBottom: {
    width: '100%',
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: px(15),
    borderBottomRightRadius: px(15),
    overflow: 'hidden',
    paddingHorizontal: px(2),
  },
  iconSectionLabel: {
    color: COLOR_TEXT['label'],
    textAlign: 'center',
  },
});
