import React, { useState } from 'react';
import { View, StyleSheet, Text, Modal, Image } from 'react-native';
import { font, os } from '@/style/font.ts';
import Button from '@components/atoms/Button.tsx';
import MarkModal from '@components/organisms/MarkModal.tsx';
import { useRecoilValue } from 'recoil';
import { selectedMarkImage } from '@/atoms/searchMark.ts';


const SelectingMark = () => {
  const [modalState, setModalState] = useState(false);
  const selectedImage = useRecoilValue(selectedMarkImage);

  const openMarkModal = (): void => {
    setModalState(true);
  };

  const onClose = () => {
    setModalState(false);
  };

  return (
    <View style={styles.selectMarkContainer}>
      <Modal visible={modalState} transparent animationType="slide">
        <MarkModal onClose={onClose} />
      </Modal>

      <View style={styles.markResultContainer}>
        <Text style={styles.markResult}>선택된 마크 :</Text>
        {selectedImage === '' ? (
          <Text style={styles.markResult}>선택 없음</Text>
        ) : (
          <Image
            source={{ uri: selectedImage }}
            style={styles.markImage}
            resizeMode="contain"
          />
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
