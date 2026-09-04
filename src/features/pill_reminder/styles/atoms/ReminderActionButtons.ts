import { StyleSheet } from 'react-native';

// 알림 카드 우측 액션 버튼 (토글 스위치 / 편집 모드 선택 체크) 스타일
export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: 52, // Switch 크기만큼 고정하여 ON/OFF 시 레이아웃 이동 방지
  },
});
