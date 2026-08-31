import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  folderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: px(16),
    paddingHorizontal: px(24),
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  folderItemSelected: {
    backgroundColor: '#F0F9FF',
    borderBottomWidth: 0,
  },
  folderInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: px(16),
  },
  folderName: {
    color: COLOR_TEXT['title'],
  },
  folderItemDisabled: {
    backgroundColor: COLOR_BG['base'],
  },
  folderNameDisabled: {
    color: COLOR_TEXT['disabled'],
  },
  folderNameSelected: {
    color: COLOR['primary'],
  },
  folderCount: {
    color: COLOR_TEXT['sub'],
  },
  shrinkText: {
    flexShrink: 1,
  },
  separator: {
    width: px(1),
    height: px(12),
    backgroundColor: COLOR_TEXT['disabled'],
    marginHorizontal: px(10),
  },
});
