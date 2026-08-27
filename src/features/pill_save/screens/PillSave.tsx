import React, { useState, useCallback } from 'react';
import { View, FlatList } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { styles } from '@features/pill_save/styles/PillSave';
import { pillSaveService } from '@features/pill_save/services/pill_save_service';
import { ISavedPillFolder } from '@services/database/types';
import { COLOR_BG } from '@constants/color';
import { px } from '@utils/responsive';
import { useRouter, useFocusEffect } from 'expo-router';

import { PillSaveLoadingView } from '@features/pill_save/components/atoms/PillSaveLoadingView';
import { PillSaveFolderItem } from '@features/pill_save/components/molecules/PillSaveFolderItem';

const PillSave = () => {
  const [folders, setFolders] = useState<
    (ISavedPillFolder & { pill_count: number; preview_images?: string[] })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadFolders = useCallback(async () => {
    setLoading(true);
    const data = await pillSaveService.getFolders();
    setFolders(data);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFolders();
    }, [loadFolders]),
  );

  if (loading) {
    return <PillSaveLoadingView />;
  }

  return (
    <View style={[styles.pillSaveRoot, { backgroundColor: COLOR_BG['base'] }]}>
      <View style={styles.header}>
        <BaseText size={14} weight="semiBold" style={styles.countText}>
          내 폴더 목록
        </BaseText>
      </View>

      <FlatList
        data={folders}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: px(20), paddingBottom: px(100) }}
        renderItem={({ item }) => (
          <PillSaveFolderItem
            item={item}
            onPress={() =>
              router.push(
                `/pill-save-folder/${item.id}?name=${encodeURIComponent(item.name)}`,
              )
            }
          />
        )}
      />
    </View>
  );
};

export default PillSave;
