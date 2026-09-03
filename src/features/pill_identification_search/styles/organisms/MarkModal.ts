import { StyleSheet, Dimensions } from 'react-native';
import { px } from '@utils/responsive';
import { COLOR } from '@constants/color';

const { height } = Dimensions.get('window');

// 식별 마크 모달 레이아웃 스타일
export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: COLOR['white'],
    paddingTop: px(12),
    paddingHorizontal: px(20),
    paddingBottom: px(40),
    borderTopLeftRadius: px(24),
    borderTopRightRadius: px(24),
    width: '100%',
    height: height * 0.85,
    elevation: 6,
  },
  searchWrapper: {
    marginBottom: px(16),
  },
});
