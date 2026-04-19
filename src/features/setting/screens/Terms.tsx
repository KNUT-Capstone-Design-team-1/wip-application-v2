import { View, Text, StyleSheet } from 'react-native';
import { TERMS } from '../constants/terms';

const Terms = () => {
  return (
    <View style={styles.termsContainer}>
      <Text style={styles.termsText}>{TERMS}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  termsContainer: {
    backgroundColor: '#fff',
  },
  termsText: {
    fontSize: 16,
    color: '#444',
  },
});

export default Terms;
