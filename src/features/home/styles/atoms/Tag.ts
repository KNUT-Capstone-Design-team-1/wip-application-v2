import { StyleSheet } from 'react-native';
import { COLOR_GRAY } from '@constants/index';
import { FONT_PAPERLOGY_WEIGHT } from '@constants/font';
import { px, fontPx } from '@utils/responsive';

export const styles = StyleSheet.create({
  tagContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: px(4),
    borderColor: COLOR_GRAY[300],
    borderWidth: px(1),
    borderRadius: px(32),
    paddingVertical: px(2),
    paddingLeft: px(8),
  },
  tagWrapper: {},
  tagTitle: {
    fontSize: fontPx(14),
    color: COLOR_GRAY[400],
    ...FONT_PAPERLOGY_WEIGHT['regular'],
  },
  deleteButton: {
    paddingVertical: px(5),
    paddingRight: px(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const IconStyles = {
  deleteIcon: {
    size: fontPx(14),
    color: COLOR_GRAY['300'],
    strokeWidth: 2,
  },
};
