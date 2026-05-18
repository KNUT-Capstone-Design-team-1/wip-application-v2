import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  infoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#32D2FF',
    marginBottom: 20,
  },
  progressBarContainer: {
    width: 250,
    height: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#32D2FF',
    borderRadius: 5,
  },
  detailsContainer: {
    alignItems: 'center',
  },
  percentText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 4,
  },
  pageText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  spinner: {
    marginVertical: 30,
  },
});
