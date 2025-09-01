import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ModalIconButton from '@components/atoms/ModalIconButton';
import { IMarkListProps } from '@/types/molecules/type';

const MarkList = ({ data, onSelect }: IMarkListProps) => {
  if (!data || data.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: 'center', marginTop: 40 }}>
        <Text style={{ color: '#999', fontSize: 16 }}>검색 결과 없음</Text>
      </View>
    );
  }

  return (
    <View style={styles.markList}>
      {data.map((item, idx) => (
        <ModalIconButton
          key={`${item.code}-${idx}`}
          item={item}
          markSelected={onSelect}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  markList: {
    paddingHorizontal: 2,
    paddingVertical: '5%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MarkList;
