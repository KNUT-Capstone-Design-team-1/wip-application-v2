import React from 'react';
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { IModalIconButton } from '@/types/atoms.type';

const ModalIconButton = ({ markSelected, item }: IModalIconButton) => {
  return (
    <TouchableOpacity
      style={styles.markCard}
      onPress={() => markSelected(item)}
      activeOpacity={0.8}
    >
      <View style={styles.imageWrapper} pointerEvents="box-none">
        <Image
          source={{ uri: item.base64 }}
          style={{ width: 40, height: 40, borderRadius: 8 }}
        />
      </View>
      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
        {item.title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  markCard: {
    width: '15%',
    height: 65,
    margin: 6,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  imageWrapper: {
    width: 60,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: '#444',
    textAlign: 'center',
  },
});

export default ModalIconButton;
