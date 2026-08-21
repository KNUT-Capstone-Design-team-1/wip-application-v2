import React from 'react';
import { BaseText } from '@components/common/BaseText';
import { styles } from '../../styles/DatabaseUpdateModal.styles';

export const ModalHeader = () => (
  <>
    <BaseText size={18} weight="bold" style={styles.title}>
      업데이트 안내
    </BaseText>
    <BaseText size={14} weight="bold" style={styles.subTitle}>
      알약 정보 업데이트
    </BaseText>
    <BaseText size={14} style={styles.description}>
      안정적인 서비스 이용을 위해 최신 버전으로 업데이트해주세요.
    </BaseText>
  </>
);
