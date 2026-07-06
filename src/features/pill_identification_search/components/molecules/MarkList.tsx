import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { FlashList } from '@shopify/flash-list';
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
        <BaseText style={styles.emptyText} size={16} weight="bold">
          검색 결과가 없습니다
        </BaseText>
      </View>
    );
  }

  const renderItem = ({ item }: { item: MarkData }) => (
    <View style={styles.itemWrapper}>
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
        <BaseText
          style={styles.gridTitle}
          numberOfLines={2}
          size={12}
          weight="semiBold"
        >
          {item.title}
        </BaseText>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlashList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.code}
      numColumns={4}
      contentContainerStyle={styles.gridContainer}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default MarkList;
