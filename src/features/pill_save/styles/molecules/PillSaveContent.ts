import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG, COLOR_LINE } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  pillSaveContentWrapper: {
    flex: 1,
    borderRadius: px(10),
    borderColor: COLOR_LINE['border'],
    borderWidth: px(1),
    backgroundColor: COLOR_BG['surface'],
    minHeight: px(190),
    paddingBottom: px(6),
    overflow: 'hidden',
    shadowColor: COLOR['shadow'],
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  checkbox: { position: 'absolute', top: 4, right: 4 },
  reminderBadge: {
    position: 'absolute',
    top: px(6),
    right: px(6),
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: px(14),
    padding: px(5),
    shadowColor: COLOR['shadow'],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
  },
});
