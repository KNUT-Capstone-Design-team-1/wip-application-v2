import { useState, useCallback } from 'react';
import { pillSaveService } from '@features/pill_save/services/pill_save_service';
import { ISavedPillFolder } from '@services/database/types';
import { useToast } from '@hooks/use_toast';
import { validateFolderName } from '@utils/validation';
import { useCommonModalStore } from '@store/common_modal_store';
import { useFocusEffect, useNavigation } from 'expo-router';

type FolderWithPillCount = ISavedPillFolder & {
  pill_count: number;
  preview_images?: string[];
};

export type FolderSortOption =
  | 'createdAt_desc'
  | 'createdAt_asc'
  | 'name_asc'
  | 'pillCount_desc';

// 폴더 보관함 화면의 비즈니스 로직을 처리하는 커스텀 훅
export const usePillSaveFolders = () => {
  const [folders, setFolders] = useState<FolderWithPillCount[]>([]);
  const [loading, setLoading] = useState(true);

  // 정렬 옵션 상태
  const [sortOption, setSortOption] = useState<FolderSortOption>('name_asc');
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);

  // 편집 모드 상태
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFolderIds, setSelectedFolderIds] = useState<number[]>([]);

  // 모달 상태
  const [isAdding, setIsAdding] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [folderInputName, setFolderInputName] = useState('');

  const { showToast } = useToast();
  const navigation = useNavigation();

  // 폴더 목록 불러오기
  const loadFolders = useCallback(async () => {
    setLoading(true);
    const data = await pillSaveService.getFolders(sortOption);
    setFolders(data);
    setLoading(false);
  }, [sortOption]);

  useFocusEffect(
    useCallback(() => {
      loadFolders();
      setIsEditing(false);
      setSelectedFolderIds([]);
    }, [loadFolders]),
  );

  // 정렬 옵션 변경
  const handleSortChange = useCallback((option: FolderSortOption) => {
    setSortOption(option);
    setIsSortModalVisible(false);
  }, []);

  // 편집 모드일 때 바텀 탭바 가리기
  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        tabBarStyle: { display: isEditing ? 'none' : 'flex' },
      });
    }, [isEditing, navigation]),
  );

  // 폴더 추가 모달 열기
  const handleOpenAddModal = useCallback(() => {
    setIsAdding(true);
    setFolderInputName('');
  }, []);

  // 모달 닫기
  const handleCancelModal = useCallback(() => {
    setIsAdding(false);
    setIsRenaming(false);
    setFolderInputName('');
  }, []);

  // 폴더 생성 또는 이름 변경 처리
  const handleCreateOrRenameFolder = useCallback(async () => {
    const trimmedName = folderInputName.trim();
    const targetId = selectedFolderIds[selectedFolderIds.length - 1];

    // 중복 이름 검사
    const isDuplicateName = folders.some(
      (f) => f.name === trimmedName && f.id !== targetId,
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
    } else if (isRenaming && targetId) {
      await pillSaveService.renameFolder(targetId, trimmedName);
      showToast({ type: 'success', message: '폴더 이름이 변경되었습니다.' });
    }

    setIsAdding(false);
    setIsRenaming(false);
    setFolderInputName('');
    loadFolders();
  }, [
    folderInputName,
    selectedFolderIds,
    folders,
    isAdding,
    isRenaming,
    loadFolders,
    showToast,
  ]);

  // 폴더 이름 변경 요청 처리 (기본 폴더 차단 및 마지막 선택 항목)
  const handleRenameRequest = useCallback(() => {
    if (selectedFolderIds.length === 0) {
      showToast({
        type: 'error',
        message: '이름을 변경할 폴더를 선택해주세요.',
      });
      return;
    }

    const targetId = selectedFolderIds[selectedFolderIds.length - 1];
    const targetFolder = folders.find((f) => f.id === targetId);

    if (targetFolder?.is_default) {
      showToast({
        type: 'error',
        message: '기본 폴더는 이름을 변경할 수 없습니다.',
      });
      return;
    }

    setIsRenaming(true);
    setFolderInputName(targetFolder?.name || '');
  }, [selectedFolderIds, folders, showToast]);

  // 폴더 삭제 처리 (기본 폴더 차단 및 모달 띄우기)
  const handleDeleteFolder = useCallback(async () => {
    if (selectedFolderIds.length === 0) {
      showToast({ type: 'error', message: '삭제할 폴더를 선택해주세요.' });
      return;
    }

    // 기본 폴더가 선택되어 있는지 확인
    const hasDefaultFolder = folders.some(
      (f) => selectedFolderIds.includes(f.id) && f.is_default,
    );

    if (hasDefaultFolder) {
      showToast({ type: 'error', message: '기본 폴더는 삭제할 수 없습니다.' });
      return;
    }

    useCommonModalStore.getState().showModal({
      title: '폴더 삭제',
      message: '선택한 폴더를 정말 삭제하시겠습니까?',
      confirmStyle: 'destructive',
      onConfirm: async () => {
        await Promise.all(
          selectedFolderIds.map((id) => pillSaveService.deleteFolder(id)),
        );
        showToast({ type: 'success', message: '폴더가 삭제되었습니다.' });
        setIsEditing(false);
        setSelectedFolderIds([]);
        loadFolders();
      },
    });
  }, [selectedFolderIds, folders, showToast, loadFolders]);

  // 개별 폴더 선택 토글 (기본 폴더는 제외)
  const toggleFolderSelection = useCallback(
    (id: number) => {
      const targetFolder = folders.find((f) => f.id === id);
      if (targetFolder?.is_default) {
        showToast({
          type: 'error',
          message: '기본 폴더는 선택할 수 없습니다.',
        });
        return;
      }

      setSelectedFolderIds((prev) =>
        prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id],
      );
    },
    [folders, showToast],
  );

  return {
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
  };
};
