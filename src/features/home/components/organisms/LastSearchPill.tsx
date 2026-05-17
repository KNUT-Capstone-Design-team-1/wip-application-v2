import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Tag from '../atoms/Tag';
import { styles } from '../../styles/organisms/LastSearchPill';
import { IPillDetail } from '../../../pill_search_result_detail/types/pill_detail_type';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LastSearchPill = ({
  lastSearchPillData,
  onDataChange,
}: {
  lastSearchPillData: IPillDetail[];
  onDataChange: () => void;
}) => {
  const tagPressHandler = (itemSeq: string) => {
    router.push({
      pathname: '/pill-search-result-detail',
      params: { ITEM_SEQ: itemSeq },
    });
  };

  const deleteRecentSearch = async (itemSeq: string) => {
    try {
      const raw = await AsyncStorage.getItem('recentSearch');
      if (raw) {
        const pills: IPillDetail[] = JSON.parse(raw);
        const updatedPills = pills.filter((pill) => pill.ITEM_SEQ !== itemSeq);
        await AsyncStorage.setItem(
          'recentSearch',
          JSON.stringify(updatedPills),
        );
        onDataChange(); // 데이터 변경 알림
      }
    } catch (error) {
      console.error('Failed to delete recent search:', error);
    }
  };

  return (
    <View style={styles.searchContainer}>
      <Text style={styles.searchTitle}>최근 검색한 알약</Text>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.searchTagList}
        showsVerticalScrollIndicator={false}
      >
        {lastSearchPillData.length === 0 ? (
          <View style={styles.notLastSearchPllDataWrapper}>
            <Text style={styles.notLastSearchPllDataText}>
              최근 검색한 알약이 없습니다.
            </Text>
          </View>
        ) : (
          lastSearchPillData.map((pill, index) => {
            return (
              <Tag
                title={pill.ITEM_NAME || ''}
                key={index}
                onPressHandler={() => tagPressHandler(pill.ITEM_SEQ || '')}
                // onDeleteHandler={() => deleteRecentSearch(pill.ITEM_SEQ || '')}
                showDelete={true}
              />
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

export default LastSearchPill;
