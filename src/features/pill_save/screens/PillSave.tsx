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
import { GuideProvider, GuideOverlay, useGuide } from '@features/guide';
import { guideStorage } from '@utils/guide_storage';
import { PILL_SAVE_TOUR } from '@features/pill_save/constants/pill_save_tour_constant';

// 보관함(폴더 목록) 본문 — GuideProvider 안에서 가이드 사용
const PillSaveContent = () => {
  const { fetchRemindedItemSeqs } = usePillReminderStore();
  const { start, autoStart } = useGuide();

  useFocusEffect(
    useCallback(() => {
      fetchRemindedItemSeqs();
    }, [fetchRemindedItemSeqs]),
  );

  // 첫 진입 시 1회 자동 노출
  useFocusEffect(
    useCallback(() => {
      autoStart(PILL_SAVE_TOUR);
    }, [autoStart]),
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
          onGuideRequest={() => start(PILL_SAVE_TOUR)}
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

// 알약 보관함(폴더 목록) 메인 화면 컴포넌트
const PillSave = () => {
  return (
    <GuideProvider storage={guideStorage}>
      <PillSaveContent />
      {/* 스포트라이트 오버레이 (Provider 안에 1회) */}
      <GuideOverlay />
    </GuideProvider>
  );
};

export default PillSave;
