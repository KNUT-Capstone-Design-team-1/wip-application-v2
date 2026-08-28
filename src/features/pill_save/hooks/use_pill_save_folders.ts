import { useState, useCallback } from 'react';
import { pillSaveService } from '@features/pill_save/services/pill_save_service';
import { ISavedPillFolder } from '@services/database/types';
import { useToast } from '@hooks/use_toast';
import { validateFolderName } from '@utils/validation';
import { useCommonModalStore } from '@store/common_modal_store';
import { useFocusEffect } from 'expo-router';

// 폴더 보관함 화면의 비즈니스 로직을 처리하는 커스텀 훅
export const usePillSaveFolders = () => {
  const [folders, setFolders] = useState<
    (ISavedPillFolder & { pill_count: number; preview_images?: string[] })[]
  >([]);

  const [loading, setLoading] = useState(true);

  // 편집 모드 상태
  const [isEditing, setIsEditing] = useState(false);
  const [editingFolderId, setEditingFolderId] = useState<number | null>(null);

  // 모달 상태
  const [isAdding, setIsAdding] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [folderInputName, setFolderInputName] = useState('');

  const { showToast } = useToast();

  // 폴더 목록 불러오기
  const loadFolders = useCallback(async () => {
    setLoading(true);

    const data = await pillSaveService.getFolders();

    setFolders(data);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFolders();
    }, [loadFolders]),
  );

  // 폴더 생성 또는 이름 변경 처리
  const handleCreateOrRenameFolder = async () => {
    const trimmedName = folderInputName.trim();

    // 중복 이름 검사
    const isDuplicateName = folders.some(
      (f) => f.name === trimmedName && f.id !== editingFolderId,
    );

    if (isDuplicateName) {
      showToast({ type: 'error', message: '이미 존재하는 폴더 이름입니다.' });
      return;
    }

    // 이름 유효성 검사
    const validation = validateFolderName(trimmedName);
    if (!validation.isValid) {
      showToast({ type: 'error', message: validation.message });
      return;
    }

    if (isAdding) {
      await pillSaveService.createFolder(trimmedName);

      showToast({ type: 'success', message: '폴더가 추가되었습니다.' });
    } else if (isRenaming && editingFolderId) {
      await pillSaveService.renameFolder(editingFolderId, trimmedName);

      showToast({ type: 'success', message: '폴더 이름이 변경되었습니다.' });
    }

    setIsAdding(false);
    setIsRenaming(false);
    setFolderInputName('');
    loadFolders();
  };

  // 폴더 삭제 처리 (모달 띄우기)
  const handleDeleteFolder = async () => {
    if (!editingFolderId) return;

    useCommonModalStore.getState().showModal({
      title: '폴더 삭제',
      message: '정말로 이 폴더를 삭제하시겠습니까?',
      confirmStyle: 'destructive',
      onConfirm: async () => {
        await pillSaveService.deleteFolder(editingFolderId);
        showToast({ type: 'success', message: '폴더가 삭제되었습니다.' });
        setIsEditing(false);
        setEditingFolderId(null);
        loadFolders();
      },
    });
  };

  // 폴더 순서 업데이트
  const updateFoldersOrder = async (data: any[]) => {
    setFolders(data);
    await pillSaveService.updateFoldersOrder(data.map((f) => f.id));
  };

  return {
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
  };
};
