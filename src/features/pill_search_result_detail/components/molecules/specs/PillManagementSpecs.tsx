import { memo, useMemo } from 'react';
import { BaseText } from '@components/common/BaseText';
import { styles } from '../../../styles/molecules/PillSpecsSection';
import type { PillDetailDataProps } from '../../../types/pill_detail_component_type';
import { getPillManagementFields } from '../../../utils/pill_specs_fields';
import PillSpecRows from './PillSpecRows';

// 관리 정보 강조·탐색 표시.
const PillManagementSpecs = ({ data }: PillDetailDataProps) => {
  const fields = useMemo(() => getPillManagementFields(data), [data]);

  return (
    <>
      <BaseText weight="bold" size={16} style={styles.sectionTitle}>
        [ 관리 정보 ]
      </BaseText>
      <PillSpecRows fields={fields} targetPrefix="management" />
    </>
  );
};

export default memo(PillManagementSpecs);
