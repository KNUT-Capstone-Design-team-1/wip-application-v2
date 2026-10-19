import { memo } from 'react';
import { View } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import KeywordText from '../atoms/KeywordText';
import { styles } from '../../styles/molecules/KeywordInfoRow';

interface Props {
  label: string;
  text?: string;
  targetId: string;
}

// 좌표 측정이 가능한 독립 텍스트로 키워드 행 표시.
const KeywordInfoRow = ({ label, text, targetId }: Props) => {
  if (!text || text === 'null') {
    return null;
  }

  return (
    <View style={styles.row}>
      <BaseText weight="semiBold" size={14} style={styles.label}>
        {label}
      </BaseText>
      <KeywordText
        text={text}
        targetId={targetId}
        weight="medium"
        size={14}
        selectable
        style={styles.value}
      />
    </View>
  );
};

export default memo(KeywordInfoRow);
