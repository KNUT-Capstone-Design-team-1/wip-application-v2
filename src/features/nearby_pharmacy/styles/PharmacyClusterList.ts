import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG, COLOR_TEXT, COLOR_LINE } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  clusterListContainer: {
    marginHorizontal: px(20),
    marginBottom: px(22),
    backgroundColor: COLOR_BG['surface'],
    borderRadius: px(15),
    paddingTop: px(10),
    paddingBottom: px(8),
    maxHeight: px(320),
    elevation: 10,
    shadowColor: COLOR['shadow'],
    shadowOffset: { width: 0, height: px(5) },
    shadowOpacity: 0.3,
    shadowRadius: 6.68,
  },
  clusterListHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: px(14),
    paddingBottom: px(6),
    borderBottomWidth: 1,
    borderBottomColor: COLOR_LINE['separator'],
  },
  clusterListTitle: {
    color: COLOR_TEXT['sub'],
  },
  clusterListCloseButton: {
    padding: px(4),
  },
  clusterListItem: {
    paddingHorizontal: px(16),
    paddingVertical: px(12),
    borderBottomWidth: 1,
    borderBottomColor: COLOR_LINE['border'],
  },
  clusterListItemLast: {
    borderBottomWidth: 0,
  },
  clusterListItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: px(4),
  },
  clusterListItemName: {
    color: COLOR_TEXT['title'],
  },
  clusterListItemDistance: {
    color: COLOR['primary'],
    marginLeft: px(8),
  },
  clusterListItemAddress: {
    color: COLOR_TEXT['body'],
  },
});
