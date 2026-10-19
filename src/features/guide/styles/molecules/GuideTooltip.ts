import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  indicator: { fontSize: 12, fontWeight: '500' },
  skip: { fontSize: 13, fontWeight: '500' },
  title: { fontSize: 17, fontWeight: '700', marginBottom: 8 },
  description: { fontSize: 14, lineHeight: 21, marginBottom: 18 },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  prevButton: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prevText: { fontSize: 14, fontWeight: '500' },
  nextButton: {
    height: 44,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextText: { fontSize: 15, fontWeight: '600' },
});
