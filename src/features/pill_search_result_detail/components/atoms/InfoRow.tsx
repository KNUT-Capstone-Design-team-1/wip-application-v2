import { View, Text } from 'react-native';
import { styles } from '../../styles/atoms/InfoRow';

interface IInfoRowProps {
  label: string;
  value?: string;
}

const InfoRow = ({ label, value }: IInfoRowProps) => {
  if (!value || value === 'null') return null;

  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
};

export default InfoRow;
