import React from 'react';
import { View, Text } from 'react-native';
import Tag from '../atoms/Tag';
import { styles } from '../../styles/organisms/LastSearchPill';

const LastSearchPill = ({
  lastSearchPillData,
}: {
  lastSearchPillData: string[];
}) => {
  const tagPressHandler = () => {
    console.log('tag click');
  };

  return (
    <View style={styles.searchContainer}>
      <Text style={styles.searchTitle}>최근 검색한 알약</Text>
      <View style={styles.searchTagList}>
        {lastSearchPillData.map((title, index) => {
          return (
            <Tag title={title} key={index} onPressHandler={tagPressHandler} />
          );
        })}
      </View>
    </View>
  );
};

export default LastSearchPill;
