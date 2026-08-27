import React, { useEffect, useState, useCallback } from 'react';
import { View } from 'react-native';
import { styles } from '@features/pill_save/styles/PillSave';
import PillSaveList from '@features/pill_save/components/organisms/PillSaveList';
import { useLocalSearchParams } from 'expo-router';
import { pillSaveService } from '@features/pill_save/services/pill_save_service';
import { IPillSaveData } from '@features/pill_save/types/pill_save_type';
import { PillSaveLoadingView } from '@features/pill_save/components/atoms/PillSaveLoadingView';
import { PillSaveCountHeader } from '@features/pill_save/components/atoms/PillSaveCountHeader';

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
    return <PillSaveLoadingView />;
  }

  return (
    <View style={styles.pillSaveRoot}>
      <PillSaveCountHeader count={pillSaveData.length} />
      <PillSaveList pillSaveData={pillSaveData} onDataChange={handleDelete} />
    </View>
  );
};

export default PillSaveFolderDetail;
