import React, { useState } from 'react';
import { View, StyleSheet, Text, Modal, Image } from 'react-native';
import { font, os } from '@/style/font';
import Button from '@components/atoms/Button';
import MarkModal from '@components/organisms/markModal/index';
import { useMarkStore } from '@store/markStore';
import { useSearchIdStore } from '@/store/searchIdStore';

const SelectingMark = () => {
  const { setSearchMark } = useSearchIdStore();
  const { selectedMarkBase64, setSelectedMarkBase64 } = useMarkStore();
  const [modalState, setModalState] = useState(false);

  const openMarkModal = (): void => {
    setModalState(true);
  };

  const onClose = () => {
    setModalState(false);
  };

  const selectedMarkDelete = () => {
    setSearchMark('');
    setSelectedMarkBase64('');
  };

  return (
    <View style={styles.selectMarkContainer}>
      <Modal visible={modalState} transparent animationType="slide">
        <MarkModal onClose={onClose} />
      </Modal>

      <View style={styles.markResultContainer}>
        <Text style={styles.markResult}>선택된 마크 :</Text>
        {selectedMarkBase64 === '' ? (
          <Text style={styles.markResult}>선택 없음</Text>
        ) : (
          <View style={styles.markImageWrapper}>
            <Text
              onPress={selectedMarkDelete}
              style={styles.selectedMarkDelete}
            >
              x
            </Text>
            <Image
              source={
                selectedMarkBase64
                  ? { uri: selectedMarkBase64 }
                  : require('@/assets/images/noImage.png')
              }
              style={styles.markImage}
              resizeMode="contain"
            />
          </View>
        )}
      </View>

      <Button.scale onPress={openMarkModal} style={{ marginTop: 10 }}>
        <View style={styles.searchButton}>
          <Text style={{ color: '#6563ed', ...styles.buttonText }}>마크</Text>
        </View>
      </Button.scale>
    </View>
  );
};

const styles = StyleSheet.create({
  selectMarkContainer: {
    marginTop: 20,
    alignItems: 'center',
    display: 'flex',
    width: '100%',
  },
  markResultContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  markImageWrapper: {
    position: 'relative',
    width: 50,
    height: 40,
  },
  selectedMarkDelete: {
    position: 'absolute',
    zIndex: 5,
    right: '-5%',
    top: -10,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#999',
    borderWidth: 2,
    borderColor: '#999',
    borderRadius: 12,
    width: 15,
    height: 15,
    textAlign: 'center',
    lineHeight: 10,
    backgroundColor: '#fff',
  },
  markResult: {
    fontWeight: '600',
  },
  markImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  searchButton: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#6563ed',
    borderRadius: 8,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingHorizontal: 160,
    paddingVertical: 12,
  },
  buttonText: {
    fontFamily: os.font(700, 800),
    fontSize: font(16),
    includeFontPadding: false,
    textAlign: 'center',
  },
});

export default SelectingMark;
