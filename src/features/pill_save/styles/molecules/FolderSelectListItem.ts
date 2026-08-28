import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  folderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: px(16),
    paddingHorizontal: px(12),
    borderBottomWidth: 1,
    borderBottomColor: COLOR_BG['base'],
  },
  folderItemSelected: {
    backgroundColor: '#F0F9FF',
    borderRadius: px(8),
    borderBottomWidth: 0,
  },
  folderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  folderName: {
    color: COLOR_TEXT['title'],
    marginRight: px(8),
  },
  folderItemDisabled: {
    backgroundColor: COLOR_BG['base'],
  },
  folderNameDisabled: {
    color: COLOR_TEXT['disabled'],
    marginRight: px(8),
  },
  folderNameSelected: {
    color: COLOR['primary'],
    marginRight: px(8),
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
    marginHorizontal: px(8),
    marginRight: px(16),
  },
});
