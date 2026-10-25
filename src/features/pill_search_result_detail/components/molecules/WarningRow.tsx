import { memo } from 'react';
import { View } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { COLOR } from '@constants/color';
import InfoRow from '@features/shared/components/InfoRow';
import { fontPx } from '@utils/responsive';
import { styles } from '../../styles/molecules/PillSafetySection';
import type { WarningRowProps } from '../../types/pill_detail_component_type';
import WarningKeywords from '../atoms/WarningKeywords';
import { AlertTriangle, Info } from 'lucide-react-native';

// 분류 여부와 해당 문구 표시.
const WarningRow = ({
  label,
  isWarning = false,
  variant = 'warning',
  prefixLabel = '해당 성분: ',
  items,
  footerNote,
}: WarningRowProps) => {
  const isReference = variant === 'reference';
  const statusStyle = isReference ? styles.referenceText : styles.warningText;
  const Icon = isReference ? Info : AlertTriangle;

  if (!isWarning) {
    return (
      <InfoRow
        label={label}
        value={isReference ? '관련 문서에서 확인되지 않음' : '해당 없음 (X)'}
      />
    );
  }

  const value = (
    <>
      <View style={styles.warningBadgeRow}>
        <Icon
          size={fontPx(14)}
          color={isReference ? COLOR.tertiary : COLOR.alert}
        />
        <BaseText weight="bold" size={14} style={statusStyle}>
          {isReference ? '문서에 언급됨' : '주의'}
        </BaseText>
      </View>
      {'\n'}
      <BaseText weight="medium" size={14} style={styles.normalText}>
        {prefixLabel}
      </BaseText>
      <BaseText weight="bold" size={14} style={statusStyle}>
        <WarningKeywords items={items} variant={variant} />
      </BaseText>
      {footerNote ? (
        <BaseText weight="semiBold" size={11} style={styles.smallInfoText}>
          {'\n' + footerNote}
        </BaseText>
      ) : null}
    </>
  );

  return <InfoRow label={label} value={value} />;
};

export default memo(WarningRow);
