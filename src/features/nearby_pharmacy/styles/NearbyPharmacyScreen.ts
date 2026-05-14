import { StyleSheet } from 'react-native';
import { COLOR, COLOR_GRAY, COLOR_PRIMARY } from '@constants/color';

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
  infoContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: COLOR.white,
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 10,
    shadowColor: COLOR.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6.68,
  },
  infoContent: {
    flex: 1,
  },
  pharmacyName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: COLOR.black,
  },
  pharmacyPhone: {
    fontSize: 14,
    color: COLOR_PRIMARY[200],
    marginBottom: 5,
    textDecorationLine: 'underline',
  },
  pharmacyAddress: {
    fontSize: 14,
    color: COLOR_GRAY[400],
  },
  closeButton: {
    padding: 10,
    backgroundColor: COLOR_GRAY[150],
    borderRadius: 10,
    marginLeft: 10,
  },
  closeButtonText: {
    color: COLOR_GRAY[400],
    fontWeight: 'bold',
  },
});
