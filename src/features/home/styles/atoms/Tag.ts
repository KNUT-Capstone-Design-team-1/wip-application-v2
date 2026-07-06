import { StyleSheet } from 'react-native';
import { COLOR_GRAY } from '@constants/index';
import { px } from '@utils/responsive';

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
    color: COLOR_GRAY[400],
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  deleteButton: {
    paddingVertical: px(5),
    paddingRight: px(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
