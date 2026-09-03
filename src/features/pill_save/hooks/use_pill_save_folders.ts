import { useState, useCallback } from 'react';
import { pillSaveService } from '@features/pill_save/services/pill_save_service';
import { ISavedPillFolder } from '@services/database/types';
import { useToast } from '@hooks/use_toast';
import { validateFolderCreation } from '../utils/pill_save_validator';
import { useCommonModalStore } from '@store/common_modal_store';
import { useFocusEffect, useNavigation } from 'expo-router';
import {
  FolderSortOption,
  DEFAULT_FOLDER_SORT,
} from '@features/pill_save/constants/pill_save_constant';

export type { FolderSortOption };

type FolderWithPillCount = ISavedPillFolder & {
  pill_count: number;
  preview_images?: string[];
};

// 폴더 보관함 화면의 UI 상태 및 비즈니스 작업을 제어하는 커스텀 훅 (Presentation Layer)
export const usePillSaveFolders = () => {
  const [folders, setFolders] = useState<FolderWithPillCount[]>([]);
  const [loading, setLoading] = useState(true);

  // 정렬 옵션 상태
  const [sortOption, setSortOption] =
    useState<FolderSortOption>(DEFAULT_FOLDER_SORT);
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

  // 화면 포커스 시 폴더 목록 조회 및 편집 모드 초기화
  useFocusEffect(
    useCallback(() => {
      loadFolders();
      setIsEditing(false);
      setSelectedFolderIds([]);
    }, [loadFolders]),
  );

  // 정렬 옵션 변경 핸들러
  const handleSortChange = useCallback((option: FolderSortOption) => {
    setSortOption(option);
    setIsSortModalVisible(false);
  }, []);

  // 편집 모드 여부에 따른 탭바 표시/숨김 처리
  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        tabBarStyle: { display: isEditing ? 'none' : 'flex' },
      });
    }, [isEditing, navigation]),
  );

  // 폴더 추가 모달 열기 핸들러
  const handleOpenAddModal = useCallback(() => {
    setIsAdding(true);
    setFolderInputName('');
  }, []);

  // 폴더 모달 닫기 핸들러
  const handleCancelModal = useCallback(() => {
    setIsAdding(false);
    setIsRenaming(false);
    setFolderInputName('');
  }, []);

  // 폴더 생성 또는 이름 변경 처리 핸들러
  const handleCreateOrRenameFolder = useCallback(async () => {
    const trimmedName = folderInputName.trim();
    const targetId = selectedFolderIds[selectedFolderIds.length - 1];

    const validation = validateFolderCreation(
      folders,
      trimmedName,
      isAdding,
      targetId,
    );

    const isInvalid = !validation.isValid;

    if (isInvalid) {
      showToast({ type: 'error', message: validation.errorMessage });
      return;
    }

    if (isAdding) {
      await pillSaveService.createFolder(trimmedName);
      showToast({ type: 'default', message: '폴더가 추가되었습니다.' });
    } else {
      const isTargetValid = isRenaming && Boolean(targetId);

      if (isTargetValid && targetId) {
        await pillSaveService.renameFolder(targetId, trimmedName);
        showToast({ type: 'default', message: '폴더 이름이 변경되었습니다.' });
      }
    }

    setIsAdding(false);
    setIsRenaming(false);
    setIsEditing(false);
    setSelectedFolderIds([]);
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

  // 폴더 이름 변경 요청 처리 핸들러 (기본 폴더 차단 및 마지막 선택 항목)
  const handleRenameRequest = useCallback(() => {
    const hasNoSelected = selectedFolderIds.length === 0;

    if (hasNoSelected) {
      showToast({
        type: 'error',
        message: '이름을 변경할 폴더를 선택해주세요.',
      });
      return;
    }

    const targetId = selectedFolderIds[selectedFolderIds.length - 1];
    const targetFolder = folders.find((f) => f.id === targetId);
    const isDefaultFolder = Boolean(targetFolder?.is_default);

    if (isDefaultFolder) {
      showToast({
        type: 'error',
        message: '기본 폴더는 이름을 변경할 수 없습니다.',
      });
      return;
    }

    setIsRenaming(true);
    setFolderInputName(targetFolder?.name || '');
  }, [selectedFolderIds, folders, showToast]);

  // 폴더 삭제 처리 핸들러 (기본 폴더 차단 및 확인 모달 띄우기)
  const handleDeleteFolder = useCallback(async () => {
    const hasNoSelected = selectedFolderIds.length === 0;

    if (hasNoSelected) {
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
      // 삭제 확인 시 일괄 삭제 실행
      onConfirm: async () => {
        await Promise.all(
          selectedFolderIds.map((id) => pillSaveService.deleteFolder(id)),
        );
        showToast({ type: 'default', message: '폴더가 삭제되었습니다.' });
        setIsEditing(false);
        setSelectedFolderIds([]);
        loadFolders();
      },
    });
  }, [selectedFolderIds, folders, showToast, loadFolders]);

  // 개별 폴더 선택 토글 핸들러 (기본 폴더는 제외)
  const toggleFolderSelection = useCallback(
    (id: number) => {
      const targetFolder = folders.find((f) => f.id === id);
      const isDefaultFolder = Boolean(targetFolder?.is_default);

      if (isDefaultFolder) {
        showToast({
          type: 'error',
          message: '기본 폴더는 선택할 수 없습니다.',
        });
        return;
      }

      setSelectedFolderIds((prev) => {
        const isCurrentlySelected = prev.includes(id);
        const next = isCurrentlySelected
          ? prev.filter((fid) => fid !== id)
          : [...prev, id];

        const shouldExitEditing = isCurrentlySelected && next.length === 0;

        if (shouldExitEditing) {
          setIsEditing(false);
        }

        return next;
      });
    },
    [folders, showToast],
  );

  // 배경 클릭 시 편집 모드 해제 핸들러
  const handleBackgroundPress = useCallback(() => {
    if (isEditing) {
      setSelectedFolderIds([]);
      setIsEditing(false);
    }
  }, [isEditing]);

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
    handleBackgroundPress,
  };
};
