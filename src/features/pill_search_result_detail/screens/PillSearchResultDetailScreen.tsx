import { View, ScrollView, Text, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import PillDetailInfo from '../components/organisms/PillDetailInfo';
import { styles } from '../styles/PillSearchResultDetailScreen';
import { usePillBox } from '@/src/features/pill_save/hooks/use_pill_box';

const PillSearchResultDetailScreen = () => {
  const { itemDetail, itemImage } = useLocalSearchParams();
  const parsedItemDetail = itemDetail ? JSON.parse(itemDetail as string) : null;

  const { saveState, toggleSave } = usePillBox(
    parsedItemDetail?.ITEM_SEQ ?? '',
  );

  const handleSaveToggle = () => {
    if (!parsedItemDetail) return;
    toggleSave({
      ITEM_SEQ: parsedItemDetail.ITEM_SEQ,
      ITEM_NAME: parsedItemDetail.ITEM_NAME,
      ENTP_NAME: parsedItemDetail.ENTP_NAME,
      ITEM_IMAGE: itemImage as string,
      CHART: parsedItemDetail.CHART,
    });
  };

  if (!parsedItemDetail) {
    return (
      <View style={styles.pillResultDetailRoot}>
        <Text>데이터를 불러올 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollViewWrapper}>
      <View style={styles.viewWrapper}>
        {/* 알약 이미지 */}
        <View style={styles.pillImgWrapper}>
          {itemImage && (
            <Image
              style={styles.pillImg}
              source={{ uri: itemImage as string }}
              resizeMode="contain"
            />
          )}
        </View>

        {/* 알약 정보 */}
        <PillDetailInfo
          data={parsedItemDetail}
          saveState={saveState}
          onSaveToggle={handleSaveToggle}
        />
      </View>
    </ScrollView>
  );
};

export default PillSearchResultDetailScreen;
