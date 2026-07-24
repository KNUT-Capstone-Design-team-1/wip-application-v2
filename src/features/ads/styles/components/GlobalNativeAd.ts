import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';
import { COLOR, COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: px(8),
  },
  adView: {
    width: '100%',
  },
  bannerLayout: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: px(12),
    paddingVertical: px(12),
    backgroundColor: COLOR_BG['surface'],
  },
  layoutBorder: {
    borderWidth: px(1),
    borderColor: COLOR_LINE['separator'],
    borderRadius: px(5),
  },
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: px(2, 4),
    marginRight: px(8),
  },
  adBadge: {
    backgroundColor: COLOR['guide'],
    paddingHorizontal: px(4),
    paddingVertical: px(1),
    borderRadius: px(3),
    zIndex: 10,
  },
  adBadgeText: {
    color: COLOR_TEXT['body'],
  },
  bannerLayoutIcon: {
    width: px(56, 56),
    height: px(56, 56),
    borderRadius: px(8),
    marginRight: px(10),
    alignSelf: 'center',
    borderWidth: px(1),
    borderColor: COLOR_LINE['border'],
  },
  contentInfo: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  headline: {
    color: COLOR_TEXT['body'],
  },
  advertiser: {
    color: COLOR_TEXT['sub'],
    marginTop: px(2),
  },
  footerWrapper: {
    flexDirection: 'row',
    marginTop: px(4),
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  starRatingWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: px(2, 2),
  },
  bannerCallToAction: {
    paddingHorizontal: px(8),
    paddingVertical: px(4),
    backgroundColor: COLOR_BG['btnTertiary'],
    borderRadius: px(5),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginLeft: px(8),
  },
  callToActionText: {
    color: COLOR_TEXT['white'],
  },
});
