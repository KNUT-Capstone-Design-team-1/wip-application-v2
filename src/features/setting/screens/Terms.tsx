import { ScrollView, StyleSheet } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { TERMS } from '../constants/terms';
import { px } from '@utils/responsive';

const Terms = () => {
  return (
    <ScrollView
      style={styles.termsContainer}
      contentContainerStyle={styles.contentContainer}
    >
      <BaseText weight="regular" size={16} style={styles.termsText}>
        {TERMS}
      </BaseText>
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
    lineHeight: px(24), // 가독성을 위해 줄 간격 추가
    color: '#444',
  },
});

export default Terms;
