import { COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  bottomSheetContainer: {
    paddingHorizontal: px(24),
    backgroundColor: COLOR_BG['surface'],
  },
  header: {
    paddingBottom: px(8),
  },
  title: {
    color: COLOR_TEXT['title'],
  },
  subtitle: {
    color: COLOR_TEXT['sub'],
    marginTop: px(4),
    paddingLeft: px(2),
  },
  actionList: {
    gap: px(10),
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR_BG['base'],
    borderRadius: px(14),
    borderWidth: px(1),
    borderColor: COLOR_LINE['border'],
    paddingVertical: px(4),
    paddingHorizontal: px(8),
    gap: px(14),
  },
  actionCardPressed: {
    opacity: 0.7,
    backgroundColor: '#E2E8F0',
  },
  iconContainer: {
    padding: px(8),
    borderRadius: px(40),
    backgroundColor: COLOR_BG['surface'],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: px(1),
    borderColor: COLOR_LINE['border'],
  },
  textContainer: {
    flex: 1,
    gap: px(2),
  },
  actionTitle: {
    color: COLOR_TEXT['title'],
  },
  actionDescription: {
    color: COLOR_TEXT['sub'],
  },
});
