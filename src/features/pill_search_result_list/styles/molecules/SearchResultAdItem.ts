import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  nativeAdViewContainer: {
    width: '100%',
  },
  // SearchResultItem의 searchItemWrapper와 100% 동일한 패딩 및 여백 (높이 132px 완벽 일치)
  searchItemWrapper: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: px(16),
    gap: px(12),
  },
  // 일반 알약 썸네일 규격과 동일한 100x100 규격
  searchItemImage: {
    width: px(100),
    height: px(100),
    borderWidth: px(1),
    borderColor: COLOR_LINE['border'],
    borderRadius: px(10),
    overflow: 'hidden',
    backgroundColor: COLOR_BG['base'],
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallbackIconContainer: {
    flex: 1,
    backgroundColor: COLOR_BG['base'],
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackIconText: {
    color: COLOR_TEXT['disabled'],
  },
  // SearchResultItem의 searchItemContents와 동일한 구조 (gap: 4px)
  searchItemContents: {
    flex: 1,
    paddingVertical: px(2),
    gap: px(4),
  },
  // 1단: [광고] 뱃지 + 헤드라인
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: px(6),
  },
  adBadge: {
    backgroundColor: COLOR['guide'],
    paddingHorizontal: px(4),
    paddingVertical: px(1),
    borderRadius: px(3),
    alignSelf: 'center',
  },
  adBadgeText: {
    color: COLOR_TEXT['body'],
  },
  headline: {
    flex: 1,
    color: COLOR_TEXT['title'],
  },
  // 2단: 광고주명 (알약 CLASS_NAME과 동일한 컬러/폰트)
  advertiser: {
    color: COLOR['item'],
  },
  // 3단: 설명 문구 (최대 2줄)
  body: {
    color: COLOR_TEXT['body'],
    lineHeight: px(15),
    includeFontPadding: false,
  },
  // 4단: 하단 행 (좌측 평점, 우측 CTA 액션 링크)
  bottomWrapper: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  ratingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: px(2),
  },
  ratingText: {
    color: COLOR_TEXT['label'],
    includeFontPadding: false,
  },
  callToActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: px(2),
  },
  callToActionText: {
    color: COLOR_TEXT['label'],
  },
});
