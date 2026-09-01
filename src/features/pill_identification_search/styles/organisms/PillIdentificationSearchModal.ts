import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';
import { COLOR, COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLOR_BG['base'] },
  otherSection: {
    paddingBottom: px(16),
    backgroundColor: COLOR['white'],
    paddingHorizontal: px(20),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLOR_BG['overlay'],
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLOR_BG['surface'],
    borderTopLeftRadius: px(20),
    borderTopRightRadius: px(20),
    height: '97%',
    paddingTop: px(20),
    flexDirection: 'column',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: px(20),
    paddingBottom: px(15),
    borderBottomWidth: 1,
    borderBottomColor: COLOR_LINE['separator'],
    position: 'relative',
  },
  modalTitle: {
    color: COLOR['primary'],
  },
  closeButton: {
    position: 'absolute',
    right: px(20),
    top: px(0),
    padding: px(5),
  },
  closeButtonText: {
    color: COLOR_TEXT['title'],
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {},
  bottomButtons: {
    flexDirection: 'row',
    paddingHorizontal: px(20),
    paddingTop: px(12),
    borderTopWidth: px(1),
    borderTopColor: COLOR_LINE['separator'],
    justifyContent: 'space-between',
    backgroundColor: COLOR_BG['surface'],
  },
});
