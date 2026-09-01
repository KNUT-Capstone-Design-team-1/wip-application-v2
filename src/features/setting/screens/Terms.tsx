import { ScrollView } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { TERMS } from '../constants/terms';
import { styles } from '../styles/screens/Terms';

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

export default Terms;
