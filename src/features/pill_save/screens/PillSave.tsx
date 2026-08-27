import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { styles } from '@features/pill_save/styles/PillSave';
import { pillSaveService } from '@features/pill_save/services/pill_save_service';
import { ISavedPillFolder } from '@services/database/types';
import { COLOR, COLOR_BG, COLOR_TEXT } from '@constants/color';
import { Folder, ChevronRight } from 'lucide-react-native';
import { px, fontPx } from '@utils/responsive';
import { useRouter, useFocusEffect } from 'expo-router';

const LoadingView = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={COLOR['primary']} />
    <BaseText size={16} weight="bold" style={styles.loadingText}>
      데이터를 불러오는 중...
    </BaseText>
  </View>
);

const PillSave = () => {
  const [folders, setFolders] = useState<
    (ISavedPillFolder & { pill_count: number })[]
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
    return <LoadingView />;
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
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: COLOR_BG['surface'],
              padding: px(20),
              marginBottom: px(12),
              borderRadius: px(16),
              elevation: 2,
              shadowColor: COLOR_TEXT['title'],
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: px(4),
            }}
            activeOpacity={0.7}
            onPress={() =>
              router.push(
                `/pill-save-folder/${item.id}?name=${encodeURIComponent(item.name)}`,
              )
            }
          >
            <Folder
              size={fontPx(28)}
              color={COLOR['primary']}
              fill={COLOR['primary']}
              style={{ opacity: 0.2, marginRight: px(16) }}
            />
            <View style={{ flex: 1 }}>
              <BaseText
                size={16}
                weight="bold"
                style={{ color: COLOR_TEXT['title'], marginBottom: px(4) }}
              >
                {item.name}
              </BaseText>
              <BaseText size={14} style={{ color: COLOR_TEXT['sub'] }}>
                알약 {item.pill_count}개
              </BaseText>
            </View>
            <ChevronRight size={fontPx(20)} color={COLOR_TEXT['disabled']} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default PillSave;
