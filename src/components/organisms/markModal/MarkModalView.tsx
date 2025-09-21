/* eslint-disable prettier/prettier */
import React from 'react';
import {
  TouchableWithoutFeedback,
  View,
  Text,
  StyleSheet,
  Keyboard,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import SearchInputAndButton from '@components/molecules/SearchInputAndButton';
import ModalPageNation from '@components/molecules/ModalPageNation';
import MarkList from '@components/molecules/MarkList';
import { IMarkModalViewProps } from '@/types/organisms.type';

const MarkModalView = ({
  loading,
  markDataList,
  page,
  totalPages,
  currentGroup,
  setPage,
  setCurrentGroup,
  handleSearch,
  markSelected,
  onClose,
  searchText,
}: IMarkModalViewProps) => {
  const textInputsObject = {
    placeholder: '예) A~Z, 꽃, 동물 등',
    placeholderTextColor: 'grey',
    onChangeText: (text: string) => {
      searchText.current = text;
    },
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        onClose();
      }}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback
          onPress={(e) => {
            e.stopPropagation && e.stopPropagation();
          }}
        >
          <View style={styles.modalBox}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>

            <Text style={styles.text}>마크 검색</Text>

            <View style={{ marginTop: 30 }}>
              <SearchInputAndButton
                textInputsObject={textInputsObject}
                buttonClickHandler={handleSearch}
              />
            </View>

            {loading ? (
              <ActivityIndicator
                size="large"
                color="#6563ed"
                style={{ height: '67.5%' }}
              />
            ) : (
              <MarkList data={markDataList} onSelect={markSelected} />
            )}

            <ModalPageNation
              totalPages={totalPages}
              page={page}
              setPage={setPage}
              currentGroup={currentGroup}
              setCurrentGroup={setCurrentGroup}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalBox: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 16,
      width: '92%',
      height: '65%',
      elevation: 6,
    },
    text: {
      fontSize: 18,
      textAlign: 'center',
      fontWeight: '700',
      color: '#333',
    },
    closeButton: {
      position: 'absolute',
      top: 14,
      right: 14,
      padding: 6,
      zIndex: 10,
    },
    closeButtonText: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#666',
    },
  });

export default MarkModalView;
