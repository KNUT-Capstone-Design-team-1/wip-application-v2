import React from 'react';
import { View, ActivityIndicator, Modal, Text } from 'react-native';
import { styles } from './styles/FullSizeLoading';
import { COLOR_PRIMARY } from '@constants/color';
import { BaseText } from './BaseText';

interface IFullSizeLoadingProps {
  visible: boolean;
  message?: string;
}

const FullSizeLoading = ({
  visible,
  message = '검색 중입니다...',
}: IFullSizeLoadingProps) => {
  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.container}>
        <View style={styles.content}>
          <ActivityIndicator size="large" color={COLOR_PRIMARY[200]} />
          {message && (
            <BaseText weight={'semiBold'} size={16} style={styles.message}>
              {message}
            </BaseText>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default FullSizeLoading;
