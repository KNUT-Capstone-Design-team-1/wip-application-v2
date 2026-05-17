import { StyleSheet } from 'react-native';
import { COLOR_GRAY, COLOR_PRIMARY } from '../../../../constants';

export const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLOR_PRIMARY[300],
    marginBottom: 12,
  },
  slotsWrapper: {
    flexDirection: 'row',
    gap: 12,
  },
  slot: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: COLOR_PRIMARY[300],
    marginBottom: 8,
    textAlign: 'center',
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptySlot: {
    aspectRatio: 1,
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLOR_GRAY[200],
    backgroundColor: COLOR_GRAY[150],
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 32,
    color: COLOR_GRAY[300],
  },
});
