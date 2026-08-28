import React from 'react';
import { View } from 'react-native';
import { styles } from '@features/pill_save/styles/PillSave';

import { PillSaveLoadingView } from '@features/pill_save/components/atoms/PillSaveLoadingView';
import { PillSaveHeader } from '@features/pill_save/components/molecules/PillSaveHeader';
import { FolderEditModal } from '@features/pill_save/components/organisms/FolderEditModal';
import PillSaveFolderList from '@features/pill_save/components/organisms/PillSaveFolderList';
import { usePillSaveFolders } from '@features/pill_save/hooks/use_pill_save_folders';

// 알약 보관함(폴더 목록) 메인 화면 컴포넌트
const PillSave = () => {
  const {
    folders,
    loading,
    isEditing,
    setIsEditing,
    editingFolderId,
    setEditingFolderId,
    isAdding,
    setIsAdding,
    isRenaming,
    setIsRenaming,
    folderInputName,
    setFolderInputName,
    handleCreateOrRenameFolder,
    handleDeleteFolder,
    updateFoldersOrder,
  } = usePillSaveFolders();

  // 로딩 중일 때 조기 반환 (Early Return)
  if (loading) {
    return <PillSaveLoadingView />;
  }

  return (
    <View style={styles.pillSaveRoot}>
      <PillSaveHeader
        isEditing={isEditing}
        folderCount={folders.length}
        onCancelEdit={() => setIsEditing(false)}
        onRenameRequest={() => {
          setIsRenaming(true);
          setFolderInputName(
            folders.find((f) => f.id === editingFolderId)?.name || '',
          );
        }}
        onDeleteRequest={handleDeleteFolder}
        onAddRequest={() => setIsAdding(true)}
      />

      <PillSaveFolderList
        folders={folders}
        isEditing={isEditing}
        editingFolderId={editingFolderId}
        setIsEditing={setIsEditing}
        setEditingFolderId={setEditingFolderId}
        updateFoldersOrder={updateFoldersOrder}
      />

      <FolderEditModal
        visible={isAdding || isRenaming}
        isAdding={isAdding}
        folderInputName={folderInputName}
        setFolderInputName={setFolderInputName}
        onCancel={() => {
          setIsAdding(false);
          setIsRenaming(false);
        }}
        onConfirm={handleCreateOrRenameFolder}
      />
    </View>
  );
};

export default PillSave;
