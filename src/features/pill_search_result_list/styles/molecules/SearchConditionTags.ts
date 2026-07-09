import { COLOR_BG, COLOR_TEXT } from '@constants/color';
import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  searchConditionContainer: {
    marginBottom: px(10),
  },
  tagList: {
    flexDirection: 'row',
    gap: px(8),
  },
  tag: {
    backgroundColor: COLOR_BG['base'],
    paddingHorizontal: px(8),
    paddingVertical: px(4),
    borderRadius: px(12),
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagLabel: {
    color: COLOR_TEXT['sub'],
    marginRight: px(4),
  },
  tagValue: {
    color: COLOR_TEXT['body'],
  },
  tagImage: {
    width: px(24),
    height: px(24),
    marginLeft: px(6),
    backgroundColor: 'transparent',
  },
});
