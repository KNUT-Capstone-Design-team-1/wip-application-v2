import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';
import { PHARMACY_INFO_CARD_MAX_HEIGHT } from '@features/nearby_pharmacy/constants/ui';

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
    maxHeight: PHARMACY_INFO_CARD_MAX_HEIGHT,
    elevation: 10,
    shadowColor: COLOR.shadow,
    shadowOffset: { width: 0, height: px(4) },
    shadowOpacity: 0.15,
    shadowRadius: px(8),
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

  headerRightArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: px(10),
    flexShrink: 0,
  },

  pharmacyStatus: {
    includeFontPadding: false,
    flexShrink: 0,
  },

  statusOpen: {
    color: COLOR.normal,
  },

  statusClosed: {
    color: COLOR_TEXT.sub,
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
