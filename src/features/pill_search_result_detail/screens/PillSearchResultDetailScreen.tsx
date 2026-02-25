import { View, ScrollView, Text, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import PillDetailInfo from '../components/organisms/PillDetailInfo';
import { styles } from '../styles/PillSearchResultDetailScreen';
import { usePillBox } from '@/src/features/pill_save/hooks/use_pill_box';
import { useEffect, useState } from 'react';
import { getPillDatasByItemSeq } from '@/src/services/database/queries/pill_data';
import { IPillDetail } from '../types/pill_detail_type';

const PillSearchResultDetailScreen = () => {
  const { itemDetail, itemImage, ITEM_SEQ } = useLocalSearchParams();
  const [pillData, setPillData] = useState<IPillDetail | null>(null);
  const [loading, setLoading] = useState(false);

  // ITEM_SEQ로 접근한 경우 데이터 조회
  useEffect(() => {
    if (ITEM_SEQ && !itemDetail) {
      loadPillData(ITEM_SEQ as string);
    } else if (itemDetail) {
      setPillData(JSON.parse(itemDetail as string));
    }
  }, [ITEM_SEQ, itemDetail]);

  const loadPillData = async (itemSeq: string) => {
    try {
      setLoading(true);
      const results = await getPillDatasByItemSeq([itemSeq]);
      if (results.length > 0) {
        setPillData(results[0]);
      }
    } catch (error) {
      console.error('Failed to load pill data:', error);
    } finally {
      setLoading(false);
    }
  };

  const { saveState, toggleSave } = usePillBox(
    pillData?.ITEM_SEQ ?? '',
  );

  const handleSaveToggle = () => {
    if (!pillData) return;
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
      <View style={styles.pillResultDetailRoot}>
        <Text>로딩 중...</Text>
      </View>
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
