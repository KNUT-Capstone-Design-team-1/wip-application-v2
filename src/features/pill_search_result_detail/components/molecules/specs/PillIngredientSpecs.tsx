import { memo } from 'react';
import { BaseText } from '@components/common/BaseText';
import InfoRow from '@features/shared/components/InfoRow';
import { IPillDetail } from '../../../types/pill_detail_type';
import { styles } from '../../../styles/molecules/PillSpecsSection';
import KeywordText from '../../atoms/KeywordText';

// 성분·저장 정보 강조 표시.
const PillIngredientSpecs = ({ data }: { data: IPillDetail }) => (
  <>
    <BaseText weight="bold" size={16} style={styles.sectionTitle}>
      [ 성분 및 저장 ]
    </BaseText>
    <InfoRow
      label="원료 성분"
      value={
        <KeywordText
          size={14}
          text={data.MATERIAL_NAME?.replace(/[;|]/g, '\n') || ''}
        />
      }
    />
    <InfoRow
      label="영문 성분명"
      value={<KeywordText size={14} text={data.MATERIAL_ENG_NAME || ''} />}
    />
    <InfoRow
      label="첨가제"
      value={
        <KeywordText
          size={14}
          text={data.INGR_NAME?.replace(/[;|]/g, '\n') || ''}
        />
      }
    />
    <InfoRow
      label="총량"
      value={<KeywordText size={14} text={data.TOTAL_CONTENT || ''} />}
    />
    <InfoRow
      label="저장 방법"
      value={<KeywordText size={14} text={data.STORAGE_METHOD || ''} />}
    />
  </>
);
export default memo(PillIngredientSpecs);
