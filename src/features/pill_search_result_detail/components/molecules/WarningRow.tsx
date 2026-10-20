import { memo } from 'react';
import { View } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { COLOR } from '@constants/color';
import InfoRow from '@features/shared/components/InfoRow';
import { fontPx } from '@utils/responsive';
import { styles } from '../../styles/molecules/PillSafetySection';
import type { WarningRowProps } from '../../types/pill_detail_component_type';
import WarningKeywords from '../atoms/WarningKeywords';
import { AlertTriangle } from 'lucide-react-native';

// 분류 여부와 해당 문구 표시.
const WarningRow = ({
  label,
  isWarning = false,
  prefixLabel = '해당 성분: ',
  items,
  footerNote,
}: WarningRowProps) => {
  if (!isWarning) {
    return <InfoRow label={label} value="해당 없음 (X)" />;
  }

  const value = (
    <>
      <View style={styles.warningBadgeRow}>
        <AlertTriangle size={fontPx(14)} color={COLOR.alert} />
        <BaseText weight="bold" size={14} style={styles.warningText}>
          주의
        </BaseText>
      </View>
      {'\n'}
      <BaseText weight="medium" size={14} style={styles.normalText}>
        {prefixLabel}
      </BaseText>
      <BaseText weight="bold" size={14} style={styles.warningText}>
        <WarningKeywords items={items} />
      </BaseText>
      {items?.length ? (
        <BaseText weight="regular" size={9} style={styles.smallInfoText}>
          {'\n키워드를 누르면 본문에서 찾아볼 수 있어요.'}
        </BaseText>
      ) : null}
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
