import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  folderItemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR_BG['surface'],
    padding: px(16),
    marginBottom: px(12),
    borderRadius: px(16),
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
