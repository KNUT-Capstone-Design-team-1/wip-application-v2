import { StyleSheet } from 'react-native';
import { COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

// 알약별 복용량 설정 섹션 스타일
export const styles = StyleSheet.create({
  sectionContainer: {
    width: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: px(12),
  },
  sectionTitle: {
    color: COLOR_TEXT.title,
  },
  dosageList: {
    gap: px(10),
  },
  dosageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: px(6),
  },
  dosagePillName: {
    color: COLOR_TEXT.title,
    flex: 1,
    marginRight: px(12),
  },
});
