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
  externalLinkButton: {
    backgroundColor: '#004A94',
    padding: 8,
    borderRadius: 5,
    marginTop: 8,
    marginBottom: 4,
    alignItems: 'center',
  },
  externalLinkButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  sourceText: {
    fontSize: 10,
    color: '#999',
    marginTop: 10,
    textAlign: 'right',
  },
  disclaimerText: {
    fontSize: 11,
    color: '#E03131',
    fontWeight: '600',
    marginTop: 5,
    marginBottom: 5,
    lineHeight: 16,
  },
  disclaimerContainer: {
    marginBottom: 10,
  },
  reportButton: {
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  reportButtonText: {
    fontSize: 11,
    color: '#E03131',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
