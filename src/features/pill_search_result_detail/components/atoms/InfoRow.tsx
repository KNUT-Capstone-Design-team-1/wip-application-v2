import { memo, ReactNode } from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../styles/atoms/InfoRow';

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
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
};

export default memo(InfoRow);
