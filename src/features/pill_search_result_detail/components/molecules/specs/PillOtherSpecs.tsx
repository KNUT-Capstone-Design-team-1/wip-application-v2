import { memo, useMemo } from 'react';
import { BaseText } from '@components/common/BaseText';
import { styles } from '../../../styles/molecules/PillSpecsSection';
import type { PillDetailDataProps } from '../../../types/pill_detail_component_type';
import { getPillOtherFields } from '../../../utils/pill_specs_fields';
import PillSpecRows from './PillSpecRows';

// 기타 강조·탐색 표시.
const PillOtherSpecs = ({ data }: PillDetailDataProps) => {
  const fields = useMemo(() => getPillOtherFields(data), [data]);

  return (
    <>
      <BaseText weight="bold" size={16} style={styles.sectionTitle}>
        [ 기타 ]
      </BaseText>
      <PillSpecRows fields={fields} targetPrefix="other" />
    </>
  );
};

export default memo(PillOtherSpecs);
