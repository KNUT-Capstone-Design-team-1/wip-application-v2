import { memo } from 'react';
import { BaseText } from '@components/common/BaseText';
import InfoRow from '@features/shared/components/InfoRow';
import { IPillDetail } from '../../../types/pill_detail_type';
import { styles } from '../../../styles/molecules/PillSpecsSection';

// 기타 분류 정보 표시.
const PillOtherSpecs = ({ data }: { data: IPillDetail }) => (
  <>
    <BaseText weight="bold" size={16} style={styles.sectionTitle}>
      [ 기타 ]
    </BaseText>

    <InfoRow label="마약류 분류" value={data.DRUG_CLASS} />
    <InfoRow label="신약 여부" value={data.NEW_DRUG_YN} />
    <InfoRow label="희귀의약품" value={data.RARE_DRUG_YN} />
  </>
);
export default memo(PillOtherSpecs);
