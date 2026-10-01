import { StyleSheet } from 'react-native';
import { COLOR_LINE } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  // 스켈레톤 스타일 (일반 아이템 구조 및 100x100 높이 완벽 일치)
  skeletonWrapper: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: px(16),
    gap: px(12),
  },
  skeletonImage: {
    width: px(100),
    height: px(100),
    borderWidth: px(1),
    borderColor: COLOR_LINE['border'],
    borderRadius: px(10),
    backgroundColor: COLOR_LINE['border'],
  },
  skeletonContents: {
    flex: 1,
    paddingVertical: px(2),
    gap: px(4),
  },
  skeletonLine: {
    height: px(13),
    backgroundColor: COLOR_LINE['border'],
    borderRadius: px(4),
  },
  skeletonLineHeader: {
    width: '65%',
  },
  skeletonLineAdvertiser: {
    width: '35%',
    height: px(11),
  },
  skeletonLineBody: {
    width: '80%',
    height: px(11),
  },
  skeletonBottomWrapper: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  skeletonLineRating: {
    width: px(34),
    height: px(11),
    backgroundColor: COLOR_LINE['border'],
    borderRadius: px(4),
  },
  skeletonLineCta: {
    width: px(45),
    height: px(11),
    backgroundColor: COLOR_LINE['border'],
    borderRadius: px(4),
  },
});
