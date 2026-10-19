import { memo, useMemo } from 'react';
import { BaseText } from '@components/common/BaseText';
import { IPillDetail } from '../../../types/pill_detail_type';
import { styles } from '../../../styles/molecules/PillSpecsSection';
import { getPillPhysicalFields } from '../../../utils/pill_specs_fields';
import PillSpecRows from './PillSpecRows';

// 상세 식별 제원 강조·탐색 표시.
const PillPhysicalSpecs = ({ data }: { data: IPillDetail }) => {
  const fields = useMemo(() => getPillPhysicalFields(data), [data]);

  return (
    <>
      <PillSpecRows fields={fields.identity} targetPrefix="physical" />
      <BaseText weight="bold" size={16} style={styles.sectionTitle}>
        [ 상세 제원 ]
      </BaseText>
      <PillSpecRows fields={fields.details} targetPrefix="physical" />
    </>
  );
};

export default memo(PillPhysicalSpecs);
