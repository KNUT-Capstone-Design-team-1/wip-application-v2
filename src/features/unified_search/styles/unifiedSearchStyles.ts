import { StyleSheet } from 'react-native';
import { COLOR_GRAY } from '@constants/index';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1.5,
    borderColor: COLOR_GRAY[200],
    // 그림자 추가 (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // 그림자 추가 (Android)
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    paddingVertical: 10,
    paddingRight: 5,
  },
  searchIcon: {
    marginRight: 8,
  },
  clearButton: {
    padding: 5,
    marginLeft: 5,
  },
  clearText: {
    fontSize: 20,
    color: COLOR_GRAY[300],
    fontWeight: 'bold',
  },
});
