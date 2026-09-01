import React from 'react';
import { View, Pressable } from 'react-native';
import { styles } from '@features/pill_save/styles/PillSave';

import { PillSaveLoadingView } from '@features/pill_save/components/atoms/PillSaveLoadingView';
import { PillSaveHeader } from '@features/pill_save/components/molecules/PillSaveHeader';
import { FolderEditModal } from '@features/pill_save/components/organisms/FolderEditModal';
import { FolderSortModal } from '@features/pill_save/components/organisms/FolderSortModal';
import PillSaveFolderList from '@features/pill_save/components/organisms/PillSaveFolderList';
import { PillSaveEditBottomBar } from '@features/pill_save/components/organisms/PillSaveEditBottomBar';
import { usePillSaveFolders } from '@features/pill_save/hooks/use_pill_save_folders';

// 알약 보관함(폴더 목록) 메인 화면 컴포넌트
const PillSave = () => {
  const {
    folders,
    loading,
    isEditing,
    setIsEditing,
    selectedFolderIds,
    setSelectedFolderIds,
    isAdding,
    isRenaming,
    folderInputName,
    setFolderInputName,
    sortOption,
    isSortModalVisible,
    setIsSortModalVisible,
    handleSortChange,
    handleCreateOrRenameFolder,
    handleRenameRequest,
    handleDeleteFolder,
    toggleFolderSelection,
    handleOpenAddModal,
    handleCancelModal,
    handleBackgroundPress,
  } = usePillSaveFolders();

  // 로딩 중일 때 조기 반환 (Early Return)
  if (loading) {
    return <PillSaveLoadingView />;
  }

  return (
    <Pressable style={styles.container} onPress={handleBackgroundPress}>
      <View style={styles.pillSaveRoot}>
        <PillSaveHeader
          isEditing={isEditing}
          folderCount={folders.length}
          onAddRequest={handleOpenAddModal}
          onSortRequest={() => setIsSortModalVisible(true)}
        />

        <PillSaveFolderList
          folders={folders}
          isEditing={isEditing}
          selectedFolderIds={selectedFolderIds}
          setIsEditing={setIsEditing}
          toggleFolderSelection={toggleFolderSelection}
        />

        <FolderSortModal
          visible={isSortModalVisible}
          onClose={() => setIsSortModalVisible(false)}
          currentSort={sortOption}
          onSortChange={handleSortChange}
        />

        <FolderEditModal
          visible={isAdding || isRenaming}
          isAdding={isAdding}
          folderInputName={folderInputName}
          setFolderInputName={setFolderInputName}
          onCancel={handleCancelModal}
          onConfirm={handleCreateOrRenameFolder}
        />

        {isEditing && (
          <PillSaveEditBottomBar
            onRename={handleRenameRequest}
            onDelete={handleDeleteFolder}
            selectedCount={selectedFolderIds.length}
          />
        )}
      </View>
    </Pressable>
  );
};

export default PillSave;
