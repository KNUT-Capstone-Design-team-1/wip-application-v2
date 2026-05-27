import { StyleSheet } from 'react-native';
import { COLOR_GRAY } from '@constants/index';
import { FONT_PAPERLOGY_WEIGHT } from '@constants/font';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 40,
    borderWidth: 1,
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
    fontSize: 14,
    lineHeight: 18,
    includeFontPadding: false,
    paddingVertical: 0,
    color: '#333',
    ...FONT_PAPERLOGY_WEIGHT['regular'],
  },
  clearButton: {
    paddingVertical: 5,
  },
});

export const IconStyles = {
  clearIcon: {
    size: 14,
    color: COLOR_GRAY[300],
    strokeWidth: 2,
  },
  searchIcon: {
    size: 14,
    color: COLOR_GRAY[300],
  },
};
