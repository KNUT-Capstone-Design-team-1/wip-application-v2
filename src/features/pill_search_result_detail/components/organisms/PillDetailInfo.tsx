import { memo } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { styles } from '../../styles/organisms/PillDetailInfo';
import { IPillDetailInfoProps } from '../../types/pill_detail_type';
import PillBasicHeader from '../molecules/PillBasicHeader';
import PillSpecsSection from '../molecules/PillSpecsSection';
import PillSafetySection from '../molecules/PillSafetySection';
import PillDescriptionSection from '../molecules/PillDescriptionSection';
import { COLOR_TEXT } from '@constants/color';
import { GlobalNativeAd } from '@features/ads/components/GlobalNativeAd';

const PillDetailInfo = ({
  data,
  saveState,
  onSaveToggle,
  onStockInquiry,
  detailLoading,
}: IPillDetailInfoProps) => {
  return (
    <View style={styles.infoContainer}>
      {/* 알약 이름 및 저장 버튼 */}
      <PillBasicHeader
        itemName={data.ITEM_NAME}
        saveState={saveState}
        onSaveToggle={onSaveToggle}
        onStockInquiry={onStockInquiry}
      />

      {/* 기본 및 상세 제원 정보 */}
      <PillSpecsSection data={data} />

      {/* 상세 정보 섹션 */}
      <View style={styles.detailInfoContainer}>
        {detailLoading ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="large" color={COLOR_TEXT['sub']} />
            <BaseText weight="medium" size={14} style={styles.emptyText}>
              상세 데이터를 불러오는 중입니다...
            </BaseText>
          </View>
        ) : (
          <>
            {/* 주의 및 특수 분류 정보 */}
            <PillSafetySection data={data} />

            {/* Native Ad 표시 위치 */}
            <GlobalNativeAd banner={true} />

            {/* 효능, 용법, 주의사항 상세 정보 */}
            <PillDescriptionSection data={data} />
          </>
        )}
      </View>
    </View>
  );
};

export default memo(PillDetailInfo);
