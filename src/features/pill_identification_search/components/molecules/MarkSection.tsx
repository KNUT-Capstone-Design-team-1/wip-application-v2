import React from 'react';
import { View, Modal } from 'react-native';
import Button from '../atoms/Button';
import { COLOR } from '@constants/color';
import { styles } from '../../styles/molecules/MarkSection';
import { useMarkModal } from '../../hooks/useMarkModal';
import MarkModal from '../organisms/MarkModal';
import SelectedMarkPreview from './SelectedMarkPreview';

// 식별 마크 선택 및 모달 제어 영역 컴포넌트 (Molecule)
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
      <Modal
        visible={modalState}
        transparent
        animationType="slide"
        onRequestClose={closeMarkModal}
      >
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

      {/* 선택된 마크 미리보기 컴포넌트 */}
      {selectedMarkBase64 ? (
        <SelectedMarkPreview
          base64={selectedMarkBase64}
          title={selectedMarkTitle}
          onDelete={deleteSelectedMark}
        />
      ) : null}

      {/* 마크 선택 버튼 */}
      <Button
        label="마크 선택하기"
        pressHandler={openMarkModal}
        background="#fff"
        color={COLOR['primary']}
        width="100%"
      />
    </View>
  );
};

export default MarkSection;
