import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import InfoRow from '../atoms/InfoRow';
import DetailSection from '../molecules/DetailSection';
import { styles } from '../../styles/organisms/PillDetailInfo';

interface IPillDetailInfoProps {
  data: any;
}

const PillDetailInfo = ({ data }: IPillDetailInfoProps) => {
  const [moreInfo, setMoreInfo] = useState(false);
  const [showEffect, setShowEffect] = useState(true);
  const [showUsage, setShowUsage] = useState(true);
  const [showWarning, setShowWarning] = useState(true);

  return (
    <View style={styles.infoContainer}>
      {/* 알약 이름 */}
      <View style={styles.nameWrapper}>
        <Text style={styles.name}>{data.ITEM_NAME}</Text>
      </View>

      {/* 기본 정보 */}
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
            <InfoRow
              label="원료 성분"
              value={data.MATERIAL_NAME?.replace(/;/g, '\n')}
            />
            <InfoRow label="첨가제" value={data.INGR_NAME} />
            <InfoRow label="저장 방법" value={data.STORAGE_METHOD} />
          </>
        )}
      </View>

      {/* 더보기 버튼 */}
      <TouchableOpacity
        style={styles.infoMoreBtn}
        onPress={() => setMoreInfo(!moreInfo)}
      >
        <Text style={styles.infoMoreBtnText}>
          {moreInfo ? '접기' : '더보기'}
        </Text>
      </TouchableOpacity>

      {/* 상세 정보 섹션 */}
      <View style={styles.detailInfoContainer}>
        <DetailSection
          title="효능/효과"
          isOpen={showEffect}
          onToggle={() => setShowEffect(!showEffect)}
          content={data.EE_DOC_DATA}
        />

        <DetailSection
          title="용법/용량"
          isOpen={showUsage}
          onToggle={() => setShowUsage(!showUsage)}
          content={data.UD_DOC_DATA}
        />

        <DetailSection
          title="사용상 주의사항"
          isOpen={showWarning}
          onToggle={() => setShowWarning(!showWarning)}
          content={data.NB_DOC_DATA}
        />
      </View>
    </View>
  );
};

export default PillDetailInfo;
