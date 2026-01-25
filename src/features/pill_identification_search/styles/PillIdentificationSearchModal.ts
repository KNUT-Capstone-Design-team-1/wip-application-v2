import { StyleSheet } from 'react-native';
import { COLOR_PRIMARY, COLOR_GRAY } from '@/src/constants';

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '97%',
    paddingTop: 20,
    flexDirection: 'column',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLOR_GRAY[150],
    position: 'relative',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLOR_PRIMARY[100],
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 0,
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    marginTop: -10,
    color: COLOR_GRAY[200],
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 20,
  },
  bottomButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: COLOR_GRAY[150],
  },
  resetButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLOR_PRIMARY[100],
    backgroundColor: '#fff',
    alignItems: 'center',
    marginRight: 10,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLOR_PRIMARY[100],
  },
  searchButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: COLOR_PRIMARY[100],
    alignItems: 'center',
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
