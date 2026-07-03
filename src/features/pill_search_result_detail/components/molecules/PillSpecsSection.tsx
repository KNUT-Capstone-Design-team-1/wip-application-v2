import { memo } from 'react';
import { View, Text } from 'react-native';
import InfoRow from '../atoms/InfoRow';
import { IPillDetail } from '../../types/pill_detail_type';
import { styles } from '../../styles/molecules/PillSpecsSection';

interface IPillSpecsSectionProps {
  data: IPillDetail;
  moreInfo: boolean;
}

const PillSpecsSection = ({ data, moreInfo }: IPillSpecsSectionProps) => {
  return (
    <View style={styles.infoWrapper}>
      <InfoRow label="제조사" value={data.ENTP_NAME} />
      <InfoRow label="주성분" value={data.MAIN_ITEM_INGR} />
      <InfoRow label="분류명" value={data.CLASS_NAME} />
      <InfoRow label="모양" value={data.DRUG_SHAPE} />
      <InfoRow label="제형" value={data.FORM_CODE} />
      <InfoRow label="성상" value={data.CHART} />
      <InfoRow
        label="식별 문자"
        value={`앞: ${data.PRINT_FRONT || '-'} / 뒤: ${data.PRINT_BACK || '-'}`}
      />
      <InfoRow label="포장 단위" value={data.PACK_UNIT} />
      <InfoRow label="유효 기간" value={data.VALID_TERM} />

      {/* 더보기 정보 */}
      {moreInfo && (
        <>
          <InfoRow label="영문명" value={data.ITEM_ENG_NAME} />
          <InfoRow label="전문/일반" value={data.ETC_OTC_CODE} />
          <InfoRow label="분류 번호" value={data.CLASS_NO} />
          <Text style={styles.sectionTitle}>[ 상세 제원 ]</Text>
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
          <Text style={styles.sectionTitle}>[ 성분 및 저장 ]</Text>
          <InfoRow
            label="원료 성분"
            value={data.MATERIAL_NAME?.replace(/[;|]/g, '\n')}
          />
          <InfoRow label="영문 성분명" value={data.MATERIAL_ENG_NAME} />
          <InfoRow
            label="첨가제"
            value={data.INGR_NAME?.replace(/[;|]/g, '\n')}
          />
          <InfoRow label="총량" value={data.TOTAL_CONTENT} />
          <InfoRow label="저장 방법" value={data.STORAGE_METHOD} />
          <Text style={styles.sectionTitle}>[ 관리 정보 ]</Text>
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
          <Text style={styles.sectionTitle}>[ 기타 ]</Text>

          <InfoRow label="마약류 분류" value={data.DRUG_CLASS} />
          <InfoRow label="신약 여부" value={data.NEW_DRUG_YN} />
          <InfoRow label="희귀의약품" value={data.RARE_DRUG_YN} />
        </>
      )}
    </View>
  );
};

export default memo(PillSpecsSection);
