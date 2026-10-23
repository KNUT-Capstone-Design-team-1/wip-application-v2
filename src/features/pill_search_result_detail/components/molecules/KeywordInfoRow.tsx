import { memo } from 'react';
import { View } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { styles } from '../../styles/keyword';
import type { KeywordInfoRowProps } from '../../types/pill_detail_component_type';
import KeywordText from '../atoms/KeywordText';

// 좌표 측정이 가능한 독립 텍스트로 키워드 행 표시.
const KeywordInfoRow = ({ label, text, targetId }: KeywordInfoRowProps) => {
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
