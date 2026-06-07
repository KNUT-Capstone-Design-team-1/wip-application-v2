import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import Button from '../atoms/Button';
import { COLOR_GRAY, COLOR_PRIMARY } from '@constants/color';
import { styles } from '../../styles/molecules/MarkSection';
import { useMarkModal } from '../../hooks/useMarkModal';
import MarkModal from '../organisms/MarkModal';
import { X } from 'lucide-react-native';
import { fontPx } from '@utils/responsive';

const MarkSection = () => {
  const {
    modalState,
    selectedMarkBase64,
    selectedMarkTitle,
    openMarkModal,
    closeMarkModal,
    deleteSelectedMark,
    searchText,
    setSearchText,
    markDataList,
    loading,
    error,
    handleSearch,
    handleMarkSelect,
    loadInitialMarks,
    currentPage,
    totalPages,
    currentGroup,
    handlePageChange,
    handleGroupChange,
  } = useMarkModal();

  return (
    <View style={styles.selectMarkContainer}>
      {/* 마크 선택 Modal */}
      <Modal visible={modalState} transparent animationType="slide">
        <MarkModal
          onClose={closeMarkModal}
          searchText={searchText}
          setSearchText={setSearchText}
          markDataList={markDataList}
          loading={loading}
          error={error}
          handleSearch={handleSearch}
          handleMarkSelect={handleMarkSelect}
          loadInitialMarks={loadInitialMarks}
          currentPage={currentPage}
          totalPages={totalPages}
          currentGroup={currentGroup}
          handlePageChange={handlePageChange}
          handleGroupChange={handleGroupChange}
        />
      </Modal>

      {/* 선택된 마크 표시 */}
      {selectedMarkBase64 && (
        <View style={styles.markResultContainer}>
          <View style={styles.markImageWrapper}>
            <Image
              source={{ uri: selectedMarkBase64 }}
              style={styles.markImage}
              contentFit="contain"
            />
          </View>
          <View style={{ justifyContent: 'center' }}>
            <Text style={styles.markTitle}>{selectedMarkTitle}</Text>
          </View>
          <TouchableOpacity
            style={styles.selectedMarkDelete}
            onPress={deleteSelectedMark}
          >
            <X size={fontPx(18)} color={COLOR_GRAY[400]} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      )}

      {/* 마크 선택 버튼 */}
      <Button
        label="마크 선택하기"
        pressHandler={openMarkModal}
        background="#fff"
        color={COLOR_PRIMARY[100]}
        width="100%"
      />
    </View>
  );
};

export default MarkSection;
