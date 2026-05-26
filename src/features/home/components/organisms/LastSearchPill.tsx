import React, { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import Tag from '../atoms/Tag';
import { styles } from '../../styles/organisms/LastSearchPill';
import { router } from 'expo-router';
import { useRecentSearchPillStore } from '@store/recent_search_pill_store';

/*
TODO
- 최근 검색한 알약 실시간 갱신이 안됨
*/

const LastSearchPill = () => {
  const { recentSearchPills, getRecentSearchPills, deleteRecentSearch } =
    useRecentSearchPillStore();

  useEffect(() => {
    getRecentSearchPills();
  }, []);

  const tagPressHandler = (itemSeq: string) => {
    router.push({
      pathname: '/pill-search-result-detail',
      params: { ITEM_SEQ: itemSeq },
    });
  };

  return (
    <View style={styles.searchContainer}>
      <Text style={styles.searchTitle}>최근 검색한 알약</Text>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.searchTagList}
        showsVerticalScrollIndicator={false}
      >
        {recentSearchPills.length === 0 ? (
          <View style={styles.notLastSearchPllDataWrapper}>
            <Text style={styles.notLastSearchPllDataText}>
              최근 검색한 알약이 없습니다.
            </Text>
          </View>
        ) : (
          recentSearchPills.map((pill, index) => {
            return (
              <Tag
                title={pill.ITEM_NAME || ''}
                key={index}
                onPressHandler={() => tagPressHandler(pill.ITEM_SEQ || '')}
                onDeleteHandler={() => deleteRecentSearch(pill.ITEM_SEQ || '')}
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
