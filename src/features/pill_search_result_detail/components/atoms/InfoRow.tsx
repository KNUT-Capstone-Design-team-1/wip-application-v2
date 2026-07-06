import { memo, ReactNode } from 'react';
import { View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';
import { styles } from '../../styles/atoms/InfoRow';
import { BaseText } from '@components/common/BaseText';

interface IInfoRowProps {
  label: string;
  value?: string | ReactNode;
}

const handleCopy = async (label: string, value: string) => {
  await Clipboard.setStringAsync(value);
  Toast.show({
    type: 'success',
    text1: '클립보드 복사',
    text2: `${label} 항목이 클립보드에 복사되었습니다.`,
  });
};

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
