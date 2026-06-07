import { ScrollView, Text, StyleSheet } from 'react-native';
import { TERMS } from '../constants/terms';
import { px, fontPx } from '@utils/responsive';

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
    padding: px(20),
    paddingBottom: px(50), // 하단 여백 추가
  },
  termsText: {
    fontFamily: 'Paperlogy',
    fontWeight: 400,
    fontSize: fontPx(16),
    lineHeight: px(24), // 가독성을 위해 줄 간격 추가
    color: '#444',
  },
});

export default Terms;
