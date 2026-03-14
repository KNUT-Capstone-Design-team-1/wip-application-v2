import { StyleSheet } from 'react-native';
import { COLOR_GRAY, COLOR_PRIMARY } from "@/src/constants";

export const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 16,
  },
  paginationButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: COLOR_PRIMARY[200],
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  paginationButtonDisabled: {
    backgroundColor: COLOR_GRAY[100],
  },
  paginationButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  paginationButtonTextDisabled: {
    color: '#888888',
  },
  pageIndicator: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
});
