import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLOR_BG.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLOR_BG.surface,
    borderTopLeftRadius: px(16),
    borderTopRightRadius: px(16),
    paddingHorizontal: px(16),
    paddingBottom: px(32),
  },
  header: {
    paddingVertical: px(20),
    borderBottomWidth: 1,
    borderBottomColor: COLOR_LINE.border,
  },
  headerTitle: { color: COLOR_TEXT.title },
  sortItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: px(16),
    paddingHorizontal: px(16),
    borderBottomWidth: 1,
    borderBottomColor: COLOR_LINE.border,
  },
  sortItemText: { color: COLOR_TEXT.body },
  activeText: { color: COLOR.primary },
});
