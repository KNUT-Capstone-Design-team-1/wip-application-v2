import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/organisms/PillDetailInfo';
import { IPillDetailInfoProps } from '../../types/pill_detail_type';
import { usePillDetail } from '../../hooks/use_pill_detail';

import PillBasicHeader from '../molecules/PillBasicHeader';
import PillSpecsSection from '../molecules/PillSpecsSection';
import PillSafetySection from '../molecules/PillSafetySection';
import PillDescriptionSection from '../molecules/PillDescriptionSection';

const PillDetailInfo = ({
  data,
  saveState,
  onSaveToggle,
}: IPillDetailInfoProps) => {
  const { recentSearch } = usePillDetail();
  const [moreInfo, setMoreInfo] = useState(false);

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
      {/* 알약 이름 및 저장 버튼 */}
      <PillBasicHeader
        itemName={data.ITEM_NAME}
        saveState={saveState}
        onSaveToggle={onSaveToggle}
      />

      {/* 기본 및 상세 제원 정보 */}
      <PillSpecsSection data={data} moreInfo={moreInfo} />

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
        {/* 주의 및 특수 분류 정보 */}
        <PillSafetySection data={data} />

        {/* 효능, 용법, 주의사항 상세 정보 */}
        <PillDescriptionSection data={data} />
      </View>
    </View>
  );
};

export default PillDetailInfo;
