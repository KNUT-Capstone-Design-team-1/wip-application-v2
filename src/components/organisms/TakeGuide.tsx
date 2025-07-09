import { font, os } from '@/style/font';
import { StyleSheet, Text, View } from 'react-native';

const TakeGuide = () => {
  const RIGHTARROW_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" width="4" height="8" viewBox="0 0 4 8" fill="none">
      <path d="M0.165111 7.82245C0.382567 8.05918 0.735166 8.05918 0.952617 7.82245L3.67418 4.85655C4.10875 4.38301 4.10858 3.61564 3.67384 3.14229L0.950613 0.177561C0.733162 -0.0591871 0.380563 -0.0591871 0.163101 0.177561C-0.0543669 0.414316 -0.0543669 0.798162 0.163101 1.03492L2.49387 3.57241C2.71138 3.80915 2.71138 4.19302 2.49387 4.42976L0.165111 6.96511C-0.0523569 7.20184 -0.0523569 7.58565 0.165111 7.82245Z" fill="#0F0F0F"/>
  </svg>
  `;

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
