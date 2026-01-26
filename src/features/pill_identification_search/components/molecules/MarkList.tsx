import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { MarkData } from '../../types/mark_types';
import { styles } from '../../styles/molecules/MarkList';

interface IMarkListProps {
  data: MarkData[];
  onSelect: (mark: MarkData) => void;
}

const MarkList = ({ data, onSelect }: IMarkListProps) => {
  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>검색 결과가 없습니다</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: MarkData }) => (
    <TouchableOpacity
      style={styles.markItem}
      onPress={() => onSelect(item)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.base64 }}
        style={styles.markImage}
        contentFit="contain"
      />
      <View style={styles.markInfo}>
        <Text style={styles.markTitle}>{item.title}</Text>
        <Text style={styles.markCode}>코드: {item.code}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.code}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={true}
    />
  );
};

export default MarkList;
