import { StyleSheet } from 'react-native';
import { COLOR, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  addFolderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: px(16),
    paddingHorizontal: px(12),
    marginBottom: px(16),
  },
  addFolderText: {
    color: COLOR_TEXT['sub'],
    marginLeft: px(8),
  },
  addFolderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: px(16),
    paddingHorizontal: px(12),
  },
  addFolderInput: {
    flex: 1,
    height: px(44),
    borderWidth: 1,
    borderColor: COLOR['primary'],
    borderRadius: px(8),
    paddingHorizontal: px(12),
    color: COLOR_TEXT['title'],
    fontFamily: 'Pretendard-Medium',
  },
  addFolderConfirmBtn: {
    backgroundColor: COLOR['primary'],
    height: px(44),
    justifyContent: 'center',
    paddingHorizontal: px(16),
    borderRadius: px(8),
    marginLeft: px(8),
  },
});
