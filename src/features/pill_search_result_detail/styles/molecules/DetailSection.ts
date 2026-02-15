import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  detailSectionWrapper: {
    marginBottom: 8,
  },
  detailInfoHeadWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 12,
  },
  detailInfoHeadText: {
    color: '#3c42ec',
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
  },
  arrowIcon: {
    color: '#3c42ec',
    fontSize: 12,
  },
  detailInfoContent: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  detailInfoText: {
    color: '#333',
    fontSize: 14,
    lineHeight: 22,
  },
});
