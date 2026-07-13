import { memo, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { styles } from '../../styles/organisms/PillDetailInfo';
import { IPillDetailInfoProps } from '../../types/pill_detail_type';

import PillBasicHeader from '../molecules/PillBasicHeader';
import PillSpecsSection from '../molecules/PillSpecsSection';
import PillSafetySection from '../molecules/PillSafetySection';
import PillDescriptionSection from '../molecules/PillDescriptionSection';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { COLOR_TEXT } from '@constants/color';
import { fontPx } from '@utils/responsive';

const PillDetailInfo = ({
  data,
  saveState,
  onSaveToggle,
}: IPillDetailInfoProps) => {
  const [moreInfo, setMoreInfo] = useState(false);

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
        onPress={() => setMoreInfo((prev) => !prev)}
      >
        {/* 더보기 가운데 정렬용 */}
        <View style={{ width: fontPx(24), height: fontPx(24) }} />
        <BaseText weight="semiBold" size={16} style={styles.infoMoreBtnText}>
          {moreInfo ? '접기' : '더보기'}
        </BaseText>
        {moreInfo ? (
          <ChevronUp
            size={fontPx(24)}
            color={COLOR_TEXT['sub']}
            strokeWidth={2}
          />
        ) : (
          <ChevronDown
            size={fontPx(24)}
            color={COLOR_TEXT['sub']}
            strokeWidth={2}
          />
        )}
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

export default memo(PillDetailInfo);
