import React, { useEffect, useState, useCallback } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { styles } from '@features/pill_save/styles/PillSave';
import PillSaveList from '@features/pill_save/components/organisms/PillSaveList';
import { useLocalSearchParams } from 'expo-router';
import { pillSaveService } from '@features/pill_save/services/pill_save_service';
import { IPillSaveData } from '@features/pill_save/types/pill_save_type';
import { COLOR } from '@constants/color';

const LoadingView = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={COLOR['primary']} />
    <BaseText size={16} weight="bold" style={styles.loadingText}>
      데이터를 불러오는 중...
    </BaseText>
  </View>
);

const SaveCountHeader = ({ count }: { count: number }) => (
  <View style={styles.header}>
    <BaseText size={14} weight="semiBold" style={styles.countText}>
      전체 개수 {count}
    </BaseText>
  </View>
);

const PillSaveFolderDetail = () => {
  const { id } = useLocalSearchParams();
  const folderId = parseInt(Array.isArray(id) ? id[0] : id, 10);

  const [pillSaveData, setPillSaveData] = useState<IPillSaveData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (isNaN(folderId)) return;
    setLoading(true);
    const data = await pillSaveService.getPillsByFolder(folderId);
    setPillSaveData(data);
    setLoading(false);
  }, [folderId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async (itemSeq: string) => {
    await pillSaveService.deletePillFromFolder(itemSeq, folderId);
    // Remove from local state
    setPillSaveData((prev) => prev.filter((item) => item.ITEM_SEQ !== itemSeq));
  };

  if (loading) {
    return <LoadingView />;
  }

  return (
    <View style={styles.pillSaveRoot}>
      <SaveCountHeader count={pillSaveData.length} />
      <PillSaveList pillSaveData={pillSaveData} onDataChange={handleDelete} />
    </View>
  );
};

export default PillSaveFolderDetail;
