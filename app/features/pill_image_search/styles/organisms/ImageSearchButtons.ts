import { StyleSheet } from 'react-native';
import { COLOR_GRAY, COLOR_PRIMARY } from "@/app/constants/color";

export const styles = StyleSheet.create({
  imageSearchButtonsWrapper: {
    display: 'flex',
    gap: 10,
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    fontSize: 16,
    width: '100%',
    height: 45,
    borderRadius: 10,
  },
  text: {
    fontWeight: 700,
    color: '#fff',
  },
  searchButton: {
    marginTop: 20,
    width: '100%',
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  hr: {
    width: '100%',
    height: 1,
    backgroundColor: COLOR_GRAY[150],
    marginTop: 30,
    marginBottom: 30,
  },
});
