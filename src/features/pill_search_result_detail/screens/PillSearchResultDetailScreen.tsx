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
  const itemSeqStr = Array.isArray(ITEM_SEQ) ? ITEM_SEQ[0] : ITEM_SEQ;
  const itemImageStr = Array.isArray(itemImage) ? itemImage[0] : itemImage;

  const [pillData, setPillData] = useState<IPillDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { loadPillDetail } = usePillDetail();

  // 데이터 로드
  useEffect(() => {
    const initData = () => {
      let initialPillData: IPillDetail | null = null;

      if (itemDetail) {
        try {
          initialPillData = JSON.parse(itemDetail as string);
          setPillData(initialPillData);
          setLoading(false);
        } catch (error) {
          console.error('Failed to parse itemDetail:', error);
        }
      }

      if (itemSeqStr) {
        // ITEM_SEQ가 있으면 상세 정보 로드 시도
        // 이미 initialPillData가 있으면 setLoading(true)를 건너뛰고 싶을 수 있지만,
        // loadPillDetail 내부에서 처리하도록 함
        loadPillDetail(
          itemSeqStr as string,
          initialPillData ? () => {} : setLoading,
          setPillData,
        );
      } else if (!itemDetail) {
        setLoading(false);
      }
    };

    initData();
  }, [itemSeqStr, itemDetail]);

  const { saveState, toggleSave } = usePillBox(pillData?.ITEM_SEQ ?? '');

  const handleSaveToggle = () => {
    if (!pillData) {
      return;
    }

    toggleSave({
      ITEM_SEQ: pillData.ITEM_SEQ,
      ITEM_NAME: pillData.ITEM_NAME,
      ENTP_NAME: pillData.ENTP_NAME,
      ITEM_IMAGE: itemImageStr || pillData.ITEM_IMAGE || '',
      CHART: pillData.CHART || '',
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
          {(itemImageStr || pillData.ITEM_IMAGE) && (
            <Image
              style={styles.pillImg}
              source={{ uri: itemImageStr || pillData.ITEM_IMAGE || '' }}
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
