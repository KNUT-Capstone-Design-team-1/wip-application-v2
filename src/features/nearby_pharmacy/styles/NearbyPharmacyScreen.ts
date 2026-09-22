import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';

// 주변 약국 화면 스타일
export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    flex: 1,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomOverlay: {
    position: 'absolute',
    width: '100%',
    zIndex: 999, // 지도보다 위에 렌더링되도록 보장
  },

  floatingControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: px(8),
    paddingHorizontal: px(20),
    marginBottom: px(8),
  },
});
