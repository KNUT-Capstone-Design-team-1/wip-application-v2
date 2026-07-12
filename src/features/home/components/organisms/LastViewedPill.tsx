import React, { useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import Tag from '../atoms/Tag';
import { styles } from '../../styles/organisms/LastViewedPill';
import { router } from 'expo-router';
import { useRecentViewedPillStore } from '@store/recent_viewed_pill_store';
import { BaseText } from '@components/common/BaseText';

const LastViewedPill = () => {
  const { recentViewedPills, getRecentViewedPills, deleteRecentViewed } =
    useRecentViewedPillStore();

  useEffect(() => {
    getRecentViewedPills();
  }, []);

  const tagPressHandler = (itemSeq: string) => {
    router.push({
      pathname: '/pill-search-result-detail',
      params: { ITEM_SEQ: itemSeq },
    });
  };

  return (
    <View style={styles.searchContainer}>
      <BaseText weight={'semiBold'} size={18} style={styles.searchTitle}>
        최근 조회한 알약
      </BaseText>
      <ScrollView
        horizontal={true}
        style={styles.scrollView}
        contentContainerStyle={styles.searchTagList}
        showsHorizontalScrollIndicator={false}
      >
        {recentViewedPills.length === 0 ? (
          <View style={styles.notLastViewedPllDataWrapper}>
            <BaseText
              weight={'medium'}
              size={16}
              style={styles.notLastViewedPllDataText}
            >
              최근 조회한 알약이 없습니다.
            </BaseText>
          </View>
        ) : (
          recentViewedPills.map((pill, index) => {
            return (
              <Tag
                title={pill.ITEM_NAME || ''}
                key={index}
                onPressHandler={() => tagPressHandler(pill.ITEM_SEQ || '')}
                onDeleteHandler={() => deleteRecentViewed(pill.ITEM_SEQ || '')}
                showDelete={true}
              />
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

export default LastViewedPill;
