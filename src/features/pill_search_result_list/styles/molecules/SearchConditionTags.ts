import { COLOR_GRAY } from '@constants/color';
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
    backgroundColor: '#F2F2F7',
    paddingHorizontal: px(8),
    paddingVertical: px(4),
    borderRadius: px(12),
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagLabel: {
    color: COLOR_GRAY[400],
    marginRight: px(4),
  },
  tagValue: {
    color: COLOR_GRAY[300],
  },
  tagImage: {
    width: px(24),
    height: px(24),
    marginLeft: px(6),
    backgroundColor: 'transparent',
  },
});
