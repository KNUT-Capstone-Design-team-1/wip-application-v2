import { memo } from 'react';
import { View } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { AlertTriangle } from 'lucide-react-native';
import { COLOR } from '@constants/color';
import { fontPx } from '@utils/responsive';
import InfoRow from '@features/shared/components/InfoRow';
import WarningKeywords from '../atoms/WarningKeywords';
import { styles } from '../../styles/molecules/PillSafetySection';

interface Props {
  label: string;
  isWarning?: boolean;
  prefixLabel?: string;
  items?: string[] | null;
  footerNote?: string;
}

// 분류 여부와 해당 문구 표시.
const WarningRow = ({
  label,
  isWarning = false,
  prefixLabel = '해당 성분: ',
  items,
  footerNote,
}: Props) => {
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
