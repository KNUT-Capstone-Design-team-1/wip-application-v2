import React from 'react';
import { View } from 'react-native';
import { styles } from '@features/pill_save/styles/PillSave';
import PillSaveList from '@features/pill_save/components/organisms/PillSaveList';
import { useLocalSearchParams } from 'expo-router';
import { PillSaveLoadingView } from '@features/pill_save/components/atoms/PillSaveLoadingView';
import { PillSaveCountHeader } from '@features/pill_save/components/atoms/PillSaveCountHeader';
import FolderSelectModal from '@features/pill_save/components/organisms/FolderSelectModal';
import { PillSaveEditBottomBar } from '@features/pill_save/components/organisms/PillSaveEditBottomBar';
import { usePillSaveFolderDetail } from '@features/pill_save/hooks/use_pill_save_folder_detail';

// 특정 알약 보관함(폴더) 내부의 알약 목록을 보여주는 상세 화면 컴포넌트
const PillSaveFolderDetail = () => {
  const { id } = useLocalSearchParams();
  const folderId = parseInt(Array.isArray(id) ? id[0] : id, 10);

  const {
    pillSaveData,
    loading,
    isEditing,
    selectedSeqs,
    isModalVisible,
    setIsModalVisible,
    modalMode,
    allSelected,
    toggleEdit,
    handleSelectAll,
    handleItemSelect,
    handleMove,
    handleCopy,
    handleSaveComplete,
    handleMultipleDelete,
  } = usePillSaveFolderDetail(folderId);

  // 로딩 중일 때 조기 반환
  if (loading) {
    return <PillSaveLoadingView />;
  }

  return (
    <View style={styles.pillSaveRoot}>
      <PillSaveCountHeader
        count={pillSaveData.length}
        isEditing={isEditing}
        onToggleEdit={toggleEdit}
        onSelectAll={handleSelectAll}
        onMove={handleMove}
        onCopy={handleCopy}
        onDelete={handleMultipleDelete}
        allSelected={allSelected}
      />
      <PillSaveList
        pillSaveData={pillSaveData}
        isEditing={isEditing}
        selectedSeqs={selectedSeqs}
        onItemSelect={handleItemSelect}
        onLongPressItem={(seq) => {
          if (!isEditing) {
            toggleEdit();
            handleItemSelect(seq);
          }
        }}
      />

      {isModalVisible && (
        <FolderSelectModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          mode={modalMode}
          sourceId={folderId}
          items={selectedSeqs.map((seq) => {
            const found = pillSaveData.find((p) => p.ITEM_SEQ === seq);
            return { seq, name: found?.ITEM_NAME || '' };
          })}
          initialSelectedIds={[]}
          onSaveComplete={handleSaveComplete}
        />
      )}

      {isEditing && (
        <PillSaveEditBottomBar
          onMove={handleMove}
          onCopy={handleCopy}
          onDelete={handleMultipleDelete}
          selectedCount={selectedSeqs.length}
        />
      )}
    </View>
  );
};

export default PillSaveFolderDetail;
