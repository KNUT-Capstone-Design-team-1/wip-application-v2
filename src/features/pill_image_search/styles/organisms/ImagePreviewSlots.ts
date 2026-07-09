import { StyleSheet } from 'react-native';
import { COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  container: {
    marginTop: px(30),
  },
  titleWrapper: {
    flexDirection: 'row',
    marginBottom: px(20),
    alignItems: 'center',
    justifyContent: 'center',
    gap: px(4),
  },
  title: {
    color: COLOR_TEXT['title'],
  },
  slotsWrapper: {
    flexDirection: 'row',
    gap: px(12),
  },
  slot: {
    flex: 1,
  },
  label: {
    color: COLOR_TEXT['label'],
    marginBottom: px(8),
    textAlign: 'center',
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: px(10),
  },
  removeButton: {
    position: 'absolute',
    top: px(4),
    right: px(4),
    width: px(24),
    height: px(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptySlot: {
    aspectRatio: 1,
    borderRadius: px(10),
    borderWidth: px(2),
    borderStyle: 'dashed',
    borderColor: COLOR_LINE['border'],
    backgroundColor: COLOR_BG['base'],
    justifyContent: 'center',
    alignItems: 'center',
  },
});
