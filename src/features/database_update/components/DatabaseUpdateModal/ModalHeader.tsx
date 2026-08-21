import React from 'react';
import { BaseText } from '@components/common/BaseText';
import { styles } from '../../styles/DatabaseUpdateModal.styles';

export const ModalHeader = () => (
  <>
    <BaseText fontFamily="Jalnan2" size={20} style={styles.title}>
      최신 정보 업데이트
    </BaseText>
    <BaseText size={15} style={styles.description}>
      새로운 정보가 추가되었습니다.
    </BaseText>
  </>
);
