import { StyleSheet } from 'react-native';
import { COLOR_BG, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  folderItemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR_BG['surface'],
    padding: px(16),
    marginBottom: px(12),
    borderRadius: px(16),
    elevation: 2,
    shadowColor: COLOR_TEXT['title'],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: px(4),
  },
  folderInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  folderName: {
    color: COLOR_TEXT['title'],
    flexShrink: 1,
  },
  separator: {
    width: px(1),
    height: px(12),
    backgroundColor: COLOR_TEXT['disabled'],
    marginHorizontal: px(8),
  },
  folderCount: {
    color: COLOR_TEXT['sub'],
  },
});
