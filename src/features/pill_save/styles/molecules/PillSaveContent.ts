import { StyleSheet } from 'react-native';
import { COLOR_GRAY } from '@constants/color';

export const styles = StyleSheet.create({
  pillSaveContentWrapper: {
    flexDirection: 'column',
    borderRadius: 10,
    borderColor: COLOR_GRAY[100],
    borderWidth: 1,
    width: '100%',
    backgroundColor: '#fff',
    minHeight: 240,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 10,
    borderRadius: 50,
  },
  pillImage: {
    width: '100%',
    height: 95,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderWidth: 2,
    borderColor: COLOR_GRAY[100],
    marginBottom: 8,
  },
  pillInfoWrapper: {
    flex: 1,
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  pillName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    lineHeight: 18,
  },
  pillCompany: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  pillChart: {
    fontSize: 11,
    color: '#999',
    lineHeight: 14,
  },
  detailButton: {
    alignSelf: 'flex-end',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  detailButtonText: {
    fontSize: 12,
    color: '#32D2FF',
  },
});
