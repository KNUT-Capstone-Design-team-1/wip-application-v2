import { memo, useMemo } from 'react';
import { BaseText } from '@components/common/BaseText';
import { IPillDetail } from '../../../types/pill_detail_type';
import { styles } from '../../../styles/molecules/PillSpecsSection';
import { getPillIngredientFields } from '../../../utils/pill_ingredient_fields';
import PillSpecRows from './PillSpecRows';

// 성분·저장 정보 강조·탐색 표시.
const PillIngredientSpecs = ({ data }: { data: IPillDetail }) => {
  const fields = useMemo(() => getPillIngredientFields(data), [data]);

  return (
    <>
      <BaseText weight="bold" size={16} style={styles.sectionTitle}>
        [ 성분 및 저장 ]
      </BaseText>
      <PillSpecRows fields={fields} targetPrefix="ingredients" />
    </>
  );
};

export default memo(PillIngredientSpecs);
