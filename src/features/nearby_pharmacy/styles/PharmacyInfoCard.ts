import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

// 약국 상세 정보 카드 스타일
export const styles = StyleSheet.create({
  infoContainer: {
    marginHorizontal: px(20),
    marginBottom: px(8),
    backgroundColor: COLOR_BG.surface,
    borderRadius: px(16),
    paddingTop: px(16),
    paddingBottom: px(14),
    paddingHorizontal: px(16),
    maxHeight: px(240),
    elevation: 10,
    shadowColor: COLOR.shadow,
    shadowOffset: { width: 0, height: px(4) },
    shadowOpacity: 0.15,
    shadowRadius: px(8),
  },

  scrollContainer: {
    flexGrow: 0,
    flexShrink: 1,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: px(8),
  },

  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: px(8),
  },

  pharmacyName: {
    color: COLOR_TEXT.title,
  },

  pharmacyDistance: {
    color: COLOR.primary,
    marginLeft: px(6),
  },

  closeButton: {
    padding: px(4),
  },

  infoContent: {
    gap: px(6),
  },

  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  pharmacyPhone: {
    color: COLOR_TEXT.subTitle,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  pharmacyPhoneDisabled: {
    color: COLOR_TEXT.disabled,
  },

  pharmacyAddress: {
    color: COLOR_TEXT.body,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  pharmacyHoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: px(4),
  },

  pharmacyHoursText: {
    color: COLOR_TEXT.body,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
