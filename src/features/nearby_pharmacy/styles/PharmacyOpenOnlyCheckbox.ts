import { StyleSheet } from 'react-native';
import { COLOR } from '@constants/color';
import { px } from '@utils/responsive';

// '영업중인 약국만 표시' 필터 체크박스 컴포넌트 스타일
export const styles = StyleSheet.create({
  // 전체 버튼 컨테이너 스타일 (우측 배치, 둥근 모서리, 그림자)
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: px(8),
    paddingHorizontal: px(12),
    borderRadius: px(13),
    elevation: 4,
    shadowColor: COLOR.shadow,
    shadowOffset: { width: 0, height: px(2) },
    shadowOpacity: 0.15,
    shadowRadius: px(4),
  },

  // 우측 체크박스 사각 테두리 영역
  checkboxWrapper: {
    width: px(18),
    height: px(18),
    borderRadius: px(4),
    borderWidth: 1.5,
    borderColor: COLOR.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: px(8),
  },

  // 체크 활성화 상태 배경색
  checkboxChecked: {
    backgroundColor: COLOR.secondary,
  },

  // 체크 비활성화 상태 배경색
  checkboxUnchecked: {
    backgroundColor: 'transparent',
  },

  // 체크마크 기호 텍스트 스타일
  checkboxCheckmark: {
    color: COLOR.white,
    lineHeight: px(14),
  },

  // 라벨 텍스트 스타일 ('현재 지도에서 검색' 버튼과 동일한 secondary 색상 적용)
  label: {
    color: COLOR.secondary,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
