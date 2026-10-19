import { memo } from 'react';
import { BaseText } from '@components/common/BaseText';
import InfoRow from '@features/shared/components/InfoRow';
import { IPillDetail } from '../../../types/pill_detail_type';
import { styles } from '../../../styles/molecules/PillSpecsSection';

// 상세 식별 제원 표시.
const PillPhysicalSpecs = ({ data }: { data: IPillDetail }) => (
  <>
    <InfoRow label="영문명" value={data.ITEM_ENG_NAME} />
    <InfoRow label="전문/일반" value={data.ETC_OTC_CODE} />
    <InfoRow label="분류 번호" value={data.CLASS_NO} />
    <BaseText weight="bold" size={16} style={styles.sectionTitle}>
      [ 상세 제원 ]
    </BaseText>
    <InfoRow
      label="색상"
      value={`${data.COLOR_CLASS1 || '-'}${data.COLOR_CLASS2 ? ` / ${data.COLOR_CLASS2}` : ''}`}
    />
    <InfoRow
      label="분할선"
      value={`앞: ${data.LINE_FRONT || '-'} / 뒤: ${data.LINE_BACK || '-'}`}
    />
    <InfoRow
      label="크기 (mm)"
      value={`장축: ${data.LENGTH_LONG || '-'} / 단축: ${data.LENGTH_SHORT || '-'} / 두께: ${data.LENGTH_THICK || '-'}`}
    />
  </>
);
export default memo(PillPhysicalSpecs);
