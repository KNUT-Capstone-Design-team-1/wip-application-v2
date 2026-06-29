import { Image } from '@components/common/CustomImage';
import { View, ScrollView, Text } from 'react-native';
import PillDetailInfo from '@features/pill_search_result_detail/components/organisms/PillDetailInfo';
import PillDetailSkeleton from '@features/pill_search_result_detail/components/organisms/PillDetailSkeleton';
import { styles } from '@features/pill_search_result_detail/styles/PillSearchResultDetailScreen';
import { usePillDetailScreen } from '@features/pill_search_result_detail/hooks/use_pill_detail_screen';

const PillSearchResultDetailScreen = () => {
  const { pillData, loading, itemImageStr, saveState, handleSaveToggle } =
    usePillDetailScreen();

  if (loading) {
    return (
      <ScrollView style={styles.scrollViewWrapper}>
        <PillDetailSkeleton />
      </ScrollView>
    );
  }

  if (!pillData) {
    return (
      <View style={styles.pillResultDetailRoot}>
        <Text style={styles.pillResultDetailNotFoundText}>
          데이터를 불러올 수 없습니다.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollViewWrapper}>
      <View style={styles.viewWrapper}>
        {/* 알약 이미지 */}
        <View style={styles.pillImgWrapper}>
          {itemImageStr || pillData.ITEM_IMAGE ? (
            <Image
              style={styles.pillImg}
              source={{ uri: itemImageStr || pillData.ITEM_IMAGE || '' }}
              contentFit="contain"
            />
          ) : (
            <View style={styles.pillDetailNoImageWrapper}>
              <Text style={styles.pillDetailNoImageText}>
                이미지가 없습니다
              </Text>
            </View>
          )}
        </View>

        {/* 알약 정보 */}
        <PillDetailInfo
          data={pillData}
          saveState={saveState}
          onSaveToggle={handleSaveToggle}
        />

        {/* 의료 정보 면책 조항 */}
        <View style={styles.disclaimerWrapper}>
          <Text style={styles.disclaimerText}>
            본 앱의 정보는 참고용이며, 정확한 의학적 진단 및 치료를 대신할 수
            없습니다. 의약품 복용 시 반드시 의사나 약사와 상담하십시오.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default PillSearchResultDetailScreen;
