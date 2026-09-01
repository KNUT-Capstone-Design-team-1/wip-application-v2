import { useState, useEffect, useCallback } from 'react';
import { pillSaveService } from '@features/pill_save/services/pill_save_service';
import { ISavedPillFolder } from '@services/database/types';
import { useToast } from '@hooks/use_toast';
import {
  validateFolderCreation,
  validateFolderSelectionLimit,
  validatePillLimit,
} from '../utils/pill_save_validator';
interface UseFolderSelectModalProps {
  isVisible: boolean;
  itemSeq?: string;
  itemName?: string;
  items?: { seq: string; name: string }[];
  mode?: 'save' | 'move' | 'copy';
  sourceId?: number;
  initialSelectedIds: number[];
  onSaveComplete: (selectedIds: number[]) => void;
  onClose: () => void;
}

// 알약 보관 폴더 선택 모달의 비즈니스 로직(선택, 생성, 저장 등)을 담당하는 커스텀 훅
export const useFolderSelectModal = ({
  isVisible,
  itemSeq,
  itemName,
  items,
  mode = 'save',
  sourceId,
  initialSelectedIds,
  onSaveComplete,
  onClose,
}: UseFolderSelectModalProps) => {
  const [folders, setFolders] = useState<
    (ISavedPillFolder & { pill_count: number })[]
  >([]);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const [newFolderName, setNewFolderName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { showToast } = useToast();

  // 폴더 목록 불러오기
  const loadFolders = useCallback(async () => {
    let data = await pillSaveService.getFolders();

    // 이동이나 복사 모드일 때 현재 폴더(sourceId)를 최상단에 고정
    const isMoveOrCopyMode = mode === 'move' || mode === 'copy';
    const hasSourceId = sourceId !== undefined;

    if (isMoveOrCopyMode && hasSourceId) {
      const sourceFolder = data.find((f) => f.id === sourceId);
      if (sourceFolder) {
        data = [sourceFolder, ...data.filter((f) => f.id !== sourceId)];
      }
    }

    setFolders(data);
  }, [mode, sourceId]);

  // 모달 열릴 때 초기 상태 및 폴더 세팅
  useEffect(() => {
    if (!isVisible) {
      return;
    }

    loadFolders();

    if (initialSelectedIds.length === 0) {
      if (mode === 'save') {
        pillSaveService.getFolders().then((data) => {
          const defaultFolder = data.find((f) => f.is_default);

          if (!defaultFolder) {
            return;
          }

          setSelectedIds([defaultFolder.id]);
        });
      } else {
        setSelectedIds([]);
      }
    } else {
      setSelectedIds(initialSelectedIds);
    }

    setIsAdding(false);
    setNewFolderName('');
    setIsSaving(false);
  }, [isVisible, initialSelectedIds, loadFolders]);

  // 폴더 선택/해제 토글
  const toggleFolder = (id: number) => {
    const isMoveOrCopyMode = mode === 'move' || mode === 'copy';
    const isSourceFolder = isMoveOrCopyMode && id === sourceId;
    const shouldBlockToggle = isSaving || isSourceFolder;

    if (shouldBlockToggle) {
      return;
    }

    setSelectedIds((prev) => {
      const isAlreadySelected = prev.includes(id);

      if (isAlreadySelected) {
        return prev.filter((fid) => fid !== id);
      }

      if (mode === 'move') {
        return [id];
      }

      const isMoveOrCopy = mode !== 'save';
      const validation = validateFolderSelectionLimit(
        prev.length,
        isMoveOrCopy,
      );

      if (!validation.isValid) {
        showToast({ type: 'error', message: validation.errorMessage });
        return prev;
      }

      return [...prev, id];
    });
  };

  // 새 폴더 생성
  const handleCreateFolder = async () => {
    const trimmedName = newFolderName.trim();

    if (isSaving) {
      return;
    }

    const validation = validateFolderCreation(folders, trimmedName, true);

    if (!validation.isValid) {
      showToast({ type: 'error', message: validation.errorMessage });
      return;
    }

    const newId = await pillSaveService.createFolder(trimmedName);

    if (!newId) {
      return;
    }

    await loadFolders();

    setSelectedIds((prev) => {
      if (mode === 'move') {
        return [newId];
      }

      const isMoveOrCopy = mode !== 'save';
      const selectionValidation = validateFolderSelectionLimit(
        prev.length,
        isMoveOrCopy,
      );

      if (!selectionValidation.isValid) {
        showToast({ type: 'error', message: selectionValidation.errorMessage });
        return prev;
      }

      return [...prev, newId];
    });
    setIsAdding(false);
    setNewFolderName('');
  };

  // 폴더 저장/이동/복사 작업을 실행하고 결과를 반환하는 함수
  const executeSaveOperation = async () => {
    let alreadyExistsItems: { seq: string; name: string }[] = [];

    const isMoveOperation = mode === 'move' && items && sourceId !== undefined;
    const isCopyOperation = mode === 'copy' && items;
    const isSaveOperation = mode === 'save' && itemSeq && itemName;

    if (isMoveOperation) {
      const result = await pillSaveService.movePillsToFolders(
        items,
        sourceId,
        selectedIds,
      );
      alreadyExistsItems = result.alreadyExistsItems;
    } else if (isCopyOperation) {
      const result = await pillSaveService.copyPillsToFolders(
        items,
        selectedIds,
      );
      alreadyExistsItems = result.alreadyExistsItems;
    } else if (isSaveOperation) {
      await pillSaveService.savePillToFolders(itemSeq, itemName, selectedIds);
    }

    return alreadyExistsItems;
  };

  // 중복된 알약에 대한 토스트 메시지를 표시하는 함수
  const showAlreadyExistsToast = (
    alreadyExistsItems: { seq: string; name: string }[],
  ) => {
    if (alreadyExistsItems.length === 0) return;

    const message =
      alreadyExistsItems.length === 1
        ? `${alreadyExistsItems[0].name}은(는) 이미 폴더에 존재합니다.`
        : `${alreadyExistsItems[0].name} 외 ${alreadyExistsItems.length - 1}개는 이미 폴더에 존재합니다.`;

    showToast({
      type: 'default',
      message,
    });
  };

  // 선택된 폴더들에 알약 저장/이동/복사 처리
  const handleSave = async () => {
    const isNoFolderSelectedForMoveOrCopy =
      selectedIds.length === 0 && mode !== 'save';

    if (isNoFolderSelectedForMoveOrCopy) {
      showToast({
        type: 'error',
        message:
          mode === 'move'
            ? '이동할 폴더를 선택해주세요.'
            : '복사할 폴더를 선택해주세요.',
      });

      return;
    }

    // 알약 최대 개수 밸리데이션
    const itemsToAddCount = items ? items.length : 1;
    const pillLimitValidation = validatePillLimit(
      folders,
      selectedIds,
      itemsToAddCount,
    );

    if (!pillLimitValidation.isValid) {
      showToast({
        type: 'error',
        message: pillLimitValidation.errorMessage,
      });
      return;
    }

    setIsSaving(true);

    try {
      const alreadyExistsItems = await executeSaveOperation();

      onSaveComplete(selectedIds);
      onClose();

      if (alreadyExistsItems.length > 0) {
        showAlreadyExistsToast(alreadyExistsItems);
      } else {
        if (mode === 'move') {
          showToast({ type: 'default', message: '이동되었습니다.' });
        } else if (mode === 'copy') {
          showToast({ type: 'default', message: '복사되었습니다.' });
        }
      }
    } catch {
      showToast({
        type: 'error',
        message: '알약 저장 중 오류가 발생했습니다.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    folders,
    selectedIds,
    isAdding,
    setIsAdding,
    newFolderName,
    setNewFolderName,
    isSaving,
    toggleFolder,
    handleCreateFolder,
    handleSave,
  };
};
