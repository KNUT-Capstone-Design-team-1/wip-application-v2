import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';
import { bottomTabSize } from '@constants/size';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: bottomTabSize.height,
    width: '100%',
    zIndex: 999,
  },
  infoContainer: {
    marginHorizontal: px(20),
    marginBottom: px(22),
    backgroundColor: COLOR_BG['surface'],
    borderRadius: px(15),
    paddingVertical: px(12),
    paddingHorizontal: px(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 10,
    shadowColor: COLOR['shadow'],
    shadowOffset: { width: 0, height: px(5) },
    shadowOpacity: 0.3,
    shadowRadius: 6.68,
  },
  infoContent: {
    flex: 1,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: px(4),
    marginBottom: px(5),
  },
  pharmacyName: {
    color: COLOR_TEXT['title'],
  },
  pharmacyPhone: {
    color: COLOR_TEXT['subTitle'],
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  pharmacyAddress: {
    color: COLOR_TEXT['body'],
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: px(8),
    right: px(8),
    padding: px(4),
  },
  markerCaptureFrame: {
    backgroundColor: 'transparent',
  },
  clusterCaptureFrame: {
    backgroundColor: 'transparent',
  },
  markerWrapper: {
    backgroundColor: COLOR['marker'],
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLOR['shadow'],
    shadowOffset: { width: 0, height: px(2) },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
  markerWrapperSelected: {
    backgroundColor: COLOR['marker'],
  },
  clusterWrapper: {
    backgroundColor: COLOR['marker'],
  },
  clusterCount: {
    color: COLOR_BG['surface'],
    fontSize: px(13),
    fontWeight: '700',
    includeFontPadding: false,
  },
  clusterListContainer: {
    marginHorizontal: px(20),
    marginBottom: px(22),
    paddingTop: px(10),
    paddingBottom: px(8),
    maxHeight: px(320),
  },
  clusterListHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: px(14),
    paddingBottom: px(10),
  },
  clusterListTitle: {
    color: COLOR_TEXT['title'],
    textShadowColor: 'white',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  clusterListCloseButton: {
    padding: px(4),
    backgroundColor: 'white',
    borderRadius: px(15),
    elevation: 2,
  },
  clusterListItem: {
    backgroundColor: COLOR_BG['surface'],
    borderRadius: px(15),
    paddingHorizontal: px(16),
    paddingVertical: px(12),
    marginBottom: px(10),
    elevation: 4,
    shadowColor: COLOR['shadow'],
    shadowOffset: { width: 0, height: px(2) },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
  },
  clusterListItemLast: {
    marginBottom: 0,
  },
  clusterListItemName: {
    color: COLOR_TEXT['title'],
    marginBottom: px(4),
  },
  clusterListItemAddress: {
    color: COLOR_TEXT['body'],
    marginBottom: px(4),
  },
  clusterListItemPhone: {
    color: COLOR_TEXT['subTitle'],
    textDecorationLine: 'underline',
  },
  clusterListItemPhoneButton: {
    alignSelf: 'flex-start',
    paddingVertical: px(2),
    paddingRight: px(8),
  },
});
