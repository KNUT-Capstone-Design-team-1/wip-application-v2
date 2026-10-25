import React, { useCallback } from 'react';
import { View, Pressable } from 'react-native';
import { styles } from '@features/pill_save/styles/PillSave';
import { useFocusEffect } from 'expo-router';
import { usePillReminderStore } from '@features/pill_reminder/store/pill_reminder_store';
import { PillSaveLoadingView } from '@features/pill_save/components/atoms/PillSaveLoadingView';
import { PillSaveHeader } from '@features/pill_save/components/molecules/PillSaveHeader';
import { FolderEditModal } from '@features/pill_save/components/organisms/FolderEditModal';
import { FolderSortModal } from '@features/pill_save/components/organisms/FolderSortModal';
import PillSaveFolderList from '@features/pill_save/components/organisms/PillSaveFolderList';
import { PillSaveEditBottomBar } from '@features/pill_save/components/organisms/PillSaveEditBottomBar';
import { usePillSaveFolders } from '@features/pill_save/hooks/use_pill_save_folders';
import { pillSaveGuide } from '@features/pill_save/guide';

const PillSave = () => {
  const { fetchRemindedItemSeqs } = usePillReminderStore();
  const replay = pillSaveGuide.useReplay();

  useFocusEffect(
    useCallback(() => {
      fetchRemindedItemSeqs();
    }, [fetchRemindedItemSeqs]),
  );

  const {
    folders,
    loading,
    isEditing,
    setIsEditing,
    selectedFolderIds,
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
          onGuideRequest={replay}
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

export default pillSaveGuide.wrap(PillSave);
