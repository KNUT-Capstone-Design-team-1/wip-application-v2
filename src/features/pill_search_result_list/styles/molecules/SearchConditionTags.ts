import { COLOR_GRAY } from '@constants/color';
import { StyleSheet } from 'react-native';
import { px, fontPx } from '@utils/responsive';

export const styles = StyleSheet.create({
  searchConditionContainer: {
    paddingHorizontal: px(20),
    marginBottom: px(10),
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: px(8),
  },
  tag: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: px(10),
    paddingVertical: px(4),
    borderRadius: px(12),
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagLabel: {
    fontFamily: 'Paperlogy',
    fontWeight: 600,
    fontSize: fontPx(12),
    color: COLOR_GRAY[400],
    marginRight: px(4),
  },
  tagValue: {
    fontFamily: 'Paperlogy',
    fontWeight: 500,
    fontSize: fontPx(12),
    color: COLOR_GRAY[300],
  },
  tagImage: {
    width: px(24),
    height: px(24),
    marginLeft: px(6),
    backgroundColor: 'transparent',
  },
});
