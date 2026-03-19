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
      style={styles.gridItem}
      onPress={() => onSelect(item)}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.base64 }}
          style={styles.gridImage}
          contentFit="contain"
        />
      </View>
      <Text style={styles.gridTitle} numberOfLines={2}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.code}
      numColumns={4}
      contentContainerStyle={styles.gridContainer}
      columnWrapperStyle={styles.columnWrapper}
      showsVerticalScrollIndicator={true}
    />
  );
};

export default MarkList;
