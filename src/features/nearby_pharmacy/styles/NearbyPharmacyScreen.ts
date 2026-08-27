import { StyleSheet } from 'react-native';
import { bottomTabSize } from '@constants/size';

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
    bottom: bottomTabSize.height,
    width: '100%',
    zIndex: 999, // 지도보다 무조건 위에 렌더링되도록 보장
  },
});
