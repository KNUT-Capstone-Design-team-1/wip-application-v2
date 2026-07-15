import React from 'react';
import { View, TouchableOpacity, useWindowDimensions } from 'react-native';
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
  const { width } = useWindowDimensions();
  // 너비에 따른 유동적 열(Column) 개수. 태블릿(600 이상): 6열 / 작은 폰(400 미만): 4열 / 일반 폰: 3열
  const numColumns = width >= 600 ? 6 : width < 400 ? 4 : 3;

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
      key={numColumns} // numColumns 변경 시 강제 리렌더링
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.code}
      numColumns={numColumns}
      contentContainerStyle={styles.gridContainer}
      scrollEnabled={true}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default MarkList;
