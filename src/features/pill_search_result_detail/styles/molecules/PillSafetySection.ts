import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  title: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
  },
  divider: {
    height: 1,
    backgroundColor: '#E9ECEF',
    marginVertical: 8,
  },
  prohibitedContainer: {
    flexDirection: 'row',
    marginTop: 5,
    marginLeft: 85,
  },
  prohibitedTextMargin: {
    fontSize: 13,
    color: '#333',
    marginRight: 15,
  },
  prohibitedText: {
    fontSize: 13,
    color: '#333',
  },
  kadaButton: {
    backgroundColor: '#004A94',
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  kadaButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sourceText: {
    fontSize: 10,
    color: '#999',
    marginTop: 10,
    textAlign: 'right',
  },
});
