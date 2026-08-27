import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
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
