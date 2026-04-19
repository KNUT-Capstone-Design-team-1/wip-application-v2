import { View, ScrollView, Text, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import PillDetailInfo from '../components/organisms/PillDetailInfo';
import PillDetailSkeleton from '../components/organisms/PillDetailSkeleton';
import { styles } from '../styles/PillSearchResultDetailScreen';
import { usePillBox } from '@features/pill_save/hooks/use_pill_box';
import { useEffect, useState } from 'react';
import { usePillDetail } from '../hooks/use_pill_detail';
import { IPillDetail } from '../types/pill_detail_type';

const PillSearchResultDetailScreen = () => {
  const { itemDetail, itemImage, ITEM_SEQ } = useLocalSearchParams();
  const [pillData, setPillData] = useState<IPillDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { loadPillDetail } = usePillDetail();

  // 데이터 로드
  useEffect(() => {
    if (itemDetail) {
      // 이전 방식: itemDetail이 전달된 경우 (하위 호환성)
      setPillData(JSON.parse(itemDetail as string));
      setLoading(false);
    } else if (ITEM_SEQ) {
      // 새 방식: ITEM_SEQ만 전달된 경우 API 호출
      loadPillDetail(ITEM_SEQ as string, setLoading, setPillData);
    }
  }, [ITEM_SEQ, itemDetail]);

  const { saveState, toggleSave } = usePillBox(pillData?.ITEM_SEQ ?? '');

  const handleSaveToggle = () => {
    if (!pillData) {
      return;
    }

    toggleSave({
      ITEM_SEQ: pillData.ITEM_SEQ,
      ITEM_NAME: pillData.ITEM_NAME,
      ENTP_NAME: pillData.ENTP_NAME,
      ITEM_IMAGE: (itemImage as string) || pillData.ITEM_IMAGE,
      CHART: pillData.CHART,
    });
  };

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
        <Text>데이터를 불러올 수 없습니다.</Text>
      </View>
    );
  }
  return (
    <ScrollView style={styles.scrollViewWrapper}>
      <View style={styles.viewWrapper}>
        {/* 알약 이미지 */}
        <View style={styles.pillImgWrapper}>
          {(itemImage || pillData.ITEM_IMAGE) && (
            <Image
              style={styles.pillImg}
              source={{ uri: (itemImage as string) || pillData.ITEM_IMAGE }}
              resizeMode="contain"
            />
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
