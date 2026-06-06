import { memo, ReactNode } from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../styles/atoms/InfoRow';

/*
TODO: value가 많을 경우 collapsible 기능을 추가하여 단축된 데이터를 보여주는게 좋아보임
*/

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
