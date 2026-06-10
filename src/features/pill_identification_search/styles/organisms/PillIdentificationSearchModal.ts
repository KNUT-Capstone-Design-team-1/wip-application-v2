import { StyleSheet } from 'react-native';
import { px, fontPx } from '@utils/responsive';
import { COLOR_PRIMARY, COLOR_GRAY } from '@constants/color';
import { bottomTabSize } from '@constants/size';

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
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
    borderBottomColor: COLOR_GRAY[150],
    position: 'relative',
  },
  modalTitle: {
    fontFamily: 'Paperlogy',
    fontSize: fontPx(18),
    fontWeight: 700,
    color: COLOR_PRIMARY[100],
  },
  closeButton: {
    position: 'absolute',
    right: px(20),
    top: px(0),
    padding: px(5),
  },
  closeButtonText: {
    fontFamily: 'Paperlogy',
    fontSize: fontPx(24),
    fontWeight: 700,
    color: COLOR_GRAY[200],
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: px(20),
  },
  bottomButtons: {
    flexDirection: 'row',
    paddingHorizontal: px(20),
    paddingTop: px(10),
    paddingBottom: px(15) + bottomTabSize.height,
    borderTopWidth: px(1),
    borderTopColor: COLOR_GRAY[150],
    justifyContent: 'space-between',
  },
});
