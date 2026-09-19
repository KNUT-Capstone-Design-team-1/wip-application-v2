import { StyleSheet } from 'react-native';
import { COLOR, COLOR_LINE, COLOR_TEXT } from '@constants/index';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR['white'],
  },
  // 상단 탭바
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: px(20),
    backgroundColor: COLOR['white'],
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: px(12),
    borderBottomWidth: px(3),
    borderBottomColor: COLOR_LINE['border'],
  },
  tabItemSelected: {
    borderBottomColor: COLOR['primary'],
  },
  tabText: {
    textAlign: 'center',
  },
  tabTextSelected: {
    color: COLOR_TEXT['title'],
  },
  tabTextUnselected: {
    color: COLOR_TEXT['sub'],
  },
  // FlashList 컨테이너
  listWrapper: {
    flex: 1,
  },
  listContentContainer: {},
  // 빈 상태
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: px(60),
  },
  emptyText: {
    color: COLOR_TEXT['sub'],
    textAlign: 'center',
  },
});
