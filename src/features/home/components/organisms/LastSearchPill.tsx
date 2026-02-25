import React from 'react';
import { View, Text } from 'react-native';
import Tag from '../atoms/Tag';
import { styles } from '../../styles/organisms/LastSearchPill';
import { IPillDetail } from '../../../pill_search_result_detail/types/pill_detail_type';
import { router } from 'expo-router';

const LastSearchPill = ({
  lastSearchPillData,
}: {
  lastSearchPillData: IPillDetail[];
}) => {
  const tagPressHandler = (itemSeq: string) => {
    console.log('itemSeq', itemSeq);
    router.push({
      pathname: '/pill-search-result-detail',
      params: { ITEM_SEQ: itemSeq },
    });
  };

  return (
    <View style={styles.searchContainer}>
      <Text style={styles.searchTitle}>최근 검색한 알약</Text>
      <View style={styles.searchTagList}>
        {lastSearchPillData.map((pill, index) => {
          return (
            <Tag
              title={pill.ITEM_NAME || ''}
              key={index}
              onPressHandler={() => tagPressHandler(pill.ITEM_SEQ || '')}
            />
          );
        })}
      </View>
    </View>
  );
};

export default LastSearchPill;
