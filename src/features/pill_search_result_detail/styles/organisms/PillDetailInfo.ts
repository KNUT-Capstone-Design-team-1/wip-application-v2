import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  infoContainer: {},
  nameWrapper: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginTop: 16,
    position: 'relative',
  },
  name: {
    color: '#000',
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    paddingRight: 20,
  },
  infoWrapper: {
    gap: 6,
    paddingBottom: 0,
    paddingVertical: 12,
  },
  infoMoreBtn: {
    borderBottomColor: '#eee',
    borderBottomWidth: 1.5,
    marginBottom: 16,
    paddingVertical: 18,
  },
  infoMoreBtnText: {
    color: '#aaa',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  detailInfoContainer: {
    paddingBottom: 200,
  },
});
