import { memo, useMemo } from 'react';
import { BaseText } from '@components/common/BaseText';
import { IPillDetail } from '../../../types/pill_detail_type';
import { styles } from '../../../styles/molecules/PillSpecsSection';
import { getPillManagementFields } from '../../../utils/pill_specs_fields';
import PillSpecRows from './PillSpecRows';

// 관리 정보 강조·탐색 표시.
const PillManagementSpecs = ({ data }: { data: IPillDetail }) => {
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
