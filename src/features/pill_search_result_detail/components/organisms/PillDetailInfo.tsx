import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import InfoRow from '../atoms/InfoRow';
import DetailSection from '../molecules/DetailSection';
import { styles } from '../../styles/organisms/PillDetailInfo';
import Save from '../../../../../assets/icons/save.svg';
import { IPillDetailInfoProps } from '../../types/pill_detail_type';
import { usePillDetail } from '../../hooks/use_pill_detail';

const PillDetailInfo = ({
  data,
  saveState,
  onSaveToggle,
}: IPillDetailInfoProps) => {
  const { recentSearch } = usePillDetail();

  const [moreInfo, setMoreInfo] = useState(false);
  const [showEffect, setShowEffect] = useState(true);
  const [showUsage, setShowUsage] = useState(true);
  const [showWarning, setShowWarning] = useState(true);

  useEffect(() => {
    if (data && data.ITEM_SEQ) {
      // recentSearch를 백그라운드에서 실행 (UI 블로킹 방지)
      recentSearch(data).catch((error) => {
        console.error('Recent search save failed:', error);
      });
    }
  }, [data.ITEM_SEQ, data.EE_DOC_DATA]); // 상세 정보(EE_DOC_DATA)가 로드되면 업데이트된 데이터로 다시 저장

  return (
    <View style={styles.infoContainer}>
      {/* 알약 이름 */}
      <View style={styles.nameWrapper}>
        <Text style={styles.name}>{data.ITEM_NAME}</Text>
        <TouchableOpacity onPress={onSaveToggle}>
          <Save
            width={15}
            height={20}
            fill={saveState ? '#32D2FF' : 'none'}
            stroke={'#32D2FF'}
          />
        </TouchableOpacity>
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
            <InfoRow label="영문명" value={data.ITEM_ENG_NAME} />
            <InfoRow label="전문/일반" value={data.ETC_OTC_CODE} />
            <InfoRow label="분류 번호" value={data.CLASS_NO} />

            <View style={{ height: 10 }} />
            <Text
              style={[
                styles.infoMoreBtnText,
                { textAlign: 'left', marginBottom: 5 },
              ]}
            >
              [ 상세 제원 ]
            </Text>
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

            <View style={{ height: 10 }} />
            <Text
              style={[
                styles.infoMoreBtnText,
                { textAlign: 'left', marginBottom: 5 },
              ]}
            >
              [ 성분 및 저장 ]
            </Text>
            <InfoRow
              label="원료 성분"
              value={data.MATERIAL_NAME?.replace(/;/g, '\n')}
            />
            <InfoRow label="영문 성분명" value={data.MATERIAL_ENG_NAME} />
            <InfoRow label="첨가제" value={data.INGR_NAME} />
            <InfoRow label="총량" value={data.TOTAL_CONTENT} />
            <InfoRow label="저장 방법" value={data.STORAGE_METHOD} />

            <View style={{ height: 10 }} />
            <Text
              style={[
                styles.infoMoreBtnText,
                { textAlign: 'left', marginBottom: 5 },
              ]}
            >
              [ 관리 정보 ]
            </Text>
            <InfoRow label="표준 코드" value={data.BAR_CODE} />
            <InfoRow
              label="보험 코드"
              value={data.INSURANCE_CODE || data.COVERAGE_ENG_NAME}
            />
            <InfoRow label="허가 일자" value={data.ITEM_PERMIT_DATE} />
            <InfoRow label="허가/신고 구분" value={data.APPROVAL_TYPE} />
            <InfoRow label="업체 영문명" value={data.ENTP_ENG_NAME} />
            <InfoRow label="업체 허가 번호" value={data.ENTP_PERMIT_NO} />
            <InfoRow
              label="사업자 번호"
              value={data.ENTP_BIZ_NO || data.BUSINESS_LICENCE_NUMBER}
            />
            <InfoRow label="위탁제조업체" value={data.OEM_ENTP_NAME} />

            {data.CANCEL_STATUS === '취소' && (
              <>
                <InfoRow label="취소 상태" value={data.CANCEL_STATUS} />
                <InfoRow label="취소 일자" value={data.CANCEL_DATE} />
              </>
            )}

            <InfoRow label="변경 일자" value={data.CHANGE_DATE} />
            <InfoRow label="변경 내용" value={data.CHANGE_CONTENT} />

            <View style={{ height: 10 }} />
            <Text
              style={[
                styles.infoMoreBtnText,
                { textAlign: 'left', marginBottom: 5 },
              ]}
            >
              [ 기타 ]
            </Text>
            <InfoRow label="재심사 대상" value={data.REEXAM_TARGET_YN} />
            <InfoRow label="재심사 기간" value={data.REEXAM_CONT} />
            <InfoRow label="마약류 분류" value={data.DRUG_CLASS} />
            <InfoRow label="신약 여부" value={data.NEW_DRUG_YN} />
            <InfoRow label="희귀의약품" value={data.RARE_DRUG_YN} />
            <InfoRow label="ATC 코드" value={data.ATC_CODE} />
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
        {/* 특수 분류 및 주의 정보 */}
        {(data.isNarcotic ||
          data.isCannabis ||
          data.isPsychotropic ||
          data.isProhibited ||
          data.isDrivingWarning) && (
          <View
            style={{
              marginBottom: 20,
              padding: 15,
              backgroundColor: '#FFF0F0',
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#FFCACA',
            }}
          >
            <Text
              style={[
                styles.infoMoreBtnText,
                {
                  textAlign: 'left',
                  color: '#FF4D4D',
                  fontWeight: 'bold',
                  marginBottom: 10,
                },
              ]}
            >
              [ 주의 및 특수 분류 정보 ]
            </Text>

            {data.isDrivingWarning && (
              <InfoRow label="운전/기계조작" value="⚠️ 주의 (O)" />
            )}

            {(data.isNarcotic || data.isCannabis || data.isPsychotropic) && (
              <>
                <View
                  style={{
                    height: 1,
                    backgroundColor: '#FFCACA',
                    marginVertical: 8,
                  }}
                />
                {data.isNarcotic && (
                  <InfoRow
                    label="마약류 (마약)"
                    value={`확인됨\n- 해당 성분: ${Array.isArray(data.narcoticIngredients) ? data.narcoticIngredients.join(', ') : '-'}`}
                  />
                )}
                {data.isCannabis && (
                  <InfoRow
                    label="마약류 (대마)"
                    value={`확인됨\n- 해당 성분: ${Array.isArray(data.cannabisIngredients) ? data.cannabisIngredients.join(', ') : '-'}`}
                  />
                )}
                {data.isPsychotropic && (
                  <InfoRow
                    label="마약류 (향정)"
                    value={`확인됨\n- 해당 성분: ${Array.isArray(data.psychotropicIngredients) ? data.psychotropicIngredients.join(', ') : '-'}`}
                  />
                )}
                <Text
                  style={{
                    fontSize: 10,
                    color: '#999',
                    marginTop: 5,
                    textAlign: 'right',
                  }}
                >
                  * 출처: 식품의약품안전처 마약정보데이터베이스
                </Text>
              </>
            )}

            {data.isProhibited && (
              <>
                <View
                  style={{
                    height: 1,
                    backgroundColor: '#FFCACA',
                    marginVertical: 8,
                  }}
                />
                <InfoRow
                  label="도핑 금지"
                  value={`확인됨 (${data.prohibitedCategory || '금지 약물'})\n- 해당 성분: ${Array.isArray(data.prohibitedIngredients) ? data.prohibitedIngredients.join(', ') : '-'}`}
                />
                <View style={{ flexDirection: 'row', marginTop: 5 }}>
                  <Text
                    style={{ fontSize: 13, color: '#333', marginRight: 15 }}
                  >
                    경기 기간 중: {data.inGameProhibited ? '❌' : '⭕'}
                  </Text>
                  <Text style={{ fontSize: 13, color: '#333' }}>
                    경기 기간 외: {data.outGameProhibited ? '❌' : '⭕'}
                  </Text>
                </View>
                <Text style={{ fontSize: 11, color: '#FF4D4D', marginTop: 10 }}>
                  ※ 예외 적용이 있을 수 있으니, KADA 버튼을 클릭하여 상세 정보를
                  확인하시기 바랍니다.
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#004A94',
                    padding: 8,
                    borderRadius: 5,
                    marginTop: 10,
                    alignItems: 'center',
                  }}
                  onPress={() => Linking.openURL('https://kada.health.kr/')}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                    KADA
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 10,
                    color: '#999',
                    marginTop: 5,
                    textAlign: 'right',
                  }}
                >
                  * 출처: 한국도핑방지위원회(KADA)
                </Text>
              </>
            )}
          </View>
        )}

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
