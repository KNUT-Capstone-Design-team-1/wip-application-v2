import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 50, // 하단 여백 추가
  },
  noticeListWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
});
