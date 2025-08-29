import { font, os } from '@/style/font';
import { StyleSheet, Text, View } from 'react-native';

const TakeGuide = () => {
  return (
    <View style={styles.takeGuide}>
      <Text style={styles.takeGuideText1}>
        본 앱의 정보는 참고용으로 제공되며
      </Text>
      <Text style={styles.takeGuideText1}>복용에 대한 최종 결정은</Text>
      <Text style={styles.takeGuideText1}>
        전문 약사와 상담 후에 이루어져야 합니다.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  takeGuide: { alignItems: 'center', gap: 1, justifyContent: 'center' },
  takeGuideText1: {
    color: '#9B0505',
    fontFamily: os.font(700, 700),
    fontSize: font(14),
    includeFontPadding: false,
    paddingBottom: 0,
  },
});

export default TakeGuide;
