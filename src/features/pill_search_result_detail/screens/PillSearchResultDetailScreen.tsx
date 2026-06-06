import { View, ScrollView, Text, Image } from 'react-native';
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
              resizeMode="contain"
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
      </View>
    </ScrollView>
  );
};

export default PillSearchResultDetailScreen;
