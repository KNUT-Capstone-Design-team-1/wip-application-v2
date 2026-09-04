import { memo, ReactNode } from 'react';
import { View } from 'react-native';
import { styles } from '../../styles/atoms/InfoRow';
import { BaseText } from '@components/common/BaseText';

interface IInfoRowProps {
  label: string;
  value?: string | ReactNode;
}

const InfoRow = ({ label, value }: IInfoRowProps) => {
  if (!value || value === 'null') {
    return null;
  }

  return (
    <View style={styles.infoRow}>
      <BaseText weight="semiBold" size={14} style={styles.infoLabel}>
        {label}
      </BaseText>
      <BaseText
        weight="medium"
        size={14}
        selectable={true}
        style={styles.infoValue}
      >
        {value}
      </BaseText>
    </View>
  );
};

export default memo(InfoRow);
