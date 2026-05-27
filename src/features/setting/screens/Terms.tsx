import { ScrollView, Text, StyleSheet } from 'react-native';
import { TERMS } from '../constants/terms';

const Terms = () => {
  return (
    <ScrollView
      style={styles.termsContainer}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.termsText}>{TERMS}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  termsContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 50, // 하단 여백 추가
  },
  termsText: {
    fontFamily: 'Paperlogy',
    fontWeight: 400,
    fontSize: 16,
    lineHeight: 24, // 가독성을 위해 줄 간격 추가
    color: '#444',
  },
});

export default Terms;
