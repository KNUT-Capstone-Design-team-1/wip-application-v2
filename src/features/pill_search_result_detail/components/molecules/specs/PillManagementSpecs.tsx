import { memo } from 'react';
import { BaseText } from '@components/common/BaseText';
import InfoRow from '@features/shared/components/InfoRow';
import { IPillDetail } from '../../../types/pill_detail_type';
import { styles } from '../../../styles/molecules/PillSpecsSection';

// 허가·보험·변경 정보 표시.
const PillManagementSpecs = ({ data }: { data: IPillDetail }) => (
  <>
    <BaseText weight="bold" size={16} style={styles.sectionTitle}>
      [ 관리 정보 ]
    </BaseText>
    <InfoRow
      label="보험 코드"
      value={data.INSURANCE_CODE || data.COVERAGE_ENG_NAME}
    />
    <InfoRow label="허가 일자" value={data.ITEM_PERMIT_DATE} />
    <InfoRow label="업체 영문명" value={data.ENTP_ENG_NAME} />
    <InfoRow label="위탁제조업체" value={data.OEM_ENTP_NAME} />

    <InfoRow label="변경 일자" value={data.CHANGE_DATE} />
    <InfoRow
      label="변경 내용"
      value={data.CHANGE_CONTENT?.replace(/[/]/g, '\n')}
    />
  </>
);
export default memo(PillManagementSpecs);
