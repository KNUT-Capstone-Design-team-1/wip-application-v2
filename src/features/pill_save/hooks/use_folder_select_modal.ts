import { useState, useEffect, useCallback } from 'react';
import { pillSaveService } from '@features/pill_save/services/pill_save_service';
import {
  IPillSaveOperationItem,
  ISavedFolderWithMeta,
} from '@features/pill_save/types/pill_save_folder_type';
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
  items?: IPillSaveOperationItem[];
  mode?: 'save' | 'move' | 'copy';
  sourceId?: number;
  initialSelectedIds: number[];
  onSaveComplete: (selectedIds: number[]) => void;
  onClose: () => void;
}

// 알약 보관 폴더 선택 모달의 비즈니스 로직 커스텀 훅 (Presentation Layer)
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
  const [folders, setFolders] = useState<ISavedFolderWithMeta[]>([]);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const [newFolderName, setNewFolderName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { showToast } = useToast();

  // 폴더 목록을 조회하고 이동/복사 모드의 현재 폴더를 앞에 배치한다.
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
    const isModalClosed = !isVisible;

    if (isModalClosed) {
      return;
    }

    loadFolders();

    const hasNoInitialIds = initialSelectedIds.length === 0;

    if (hasNoInitialIds) {
      const isSaveMode = mode === 'save';

      if (isSaveMode) {
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
  }, [isVisible, initialSelectedIds, loadFolders, mode]);

  // 선택한 폴더를 저장 대상에 추가하거나 대상에서 제거한다.
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

      const isMoveMode = mode === 'move';

      if (isMoveMode) {
        return [id];
      }

      const isMoveOrCopy = mode !== 'save';
      const validation = validateFolderSelectionLimit(
        prev.length,
        isMoveOrCopy,
      );

      const isInvalid = !validation.isValid;

      if (isInvalid) {
        showToast({ type: 'error', message: validation.errorMessage });
        return prev;
      }

      return [...prev, id];
    });
  };

  // 새 폴더를 생성하고 저장 대상 폴더로 자동 선택한다.
  const handleCreateFolder = async () => {
    const trimmedName = newFolderName.trim();

    if (isSaving) {
      return;
    }

    const validation = validateFolderCreation(folders, trimmedName, true);
    const isInvalid = !validation.isValid;

    if (isInvalid) {
      showToast({ type: 'error', message: validation.errorMessage });
      return;
    }

    const newId = await pillSaveService.createFolder(trimmedName);
    const isCreationFailed = !newId;

    if (isCreationFailed) {
      return;
    }

    await loadFolders();

    setSelectedIds((prev) => {
      const isMoveMode = mode === 'move';

      if (isMoveMode) {
        return [newId];
      }

      const isMoveOrCopy = mode !== 'save';
      const selectionValidation = validateFolderSelectionLimit(
        prev.length,
        isMoveOrCopy,
      );

      const isSelectionInvalid = !selectionValidation.isValid;

      if (isSelectionInvalid) {
        showToast({ type: 'error', message: selectionValidation.errorMessage });
        return prev;
      }

      return [...prev, newId];
    });

    setIsAdding(false);
    setNewFolderName('');
  };

  // 모드에 맞는 폴더 저장, 이동 또는 복사 작업을 실행한다.
  const executeSaveOperation = async () => {
    let alreadyExistsItems: IPillSaveOperationItem[] = [];

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

  // 중복된 알약에 대한 토스트 메시지를 표시하는 헬퍼 함수
  const showAlreadyExistsToast = (
    alreadyExistsItems: IPillSaveOperationItem[],
  ) => {
    const hasNoDuplicate = alreadyExistsItems.length === 0;

    if (hasNoDuplicate) {
      return;
    }

    const isOnlyOne = alreadyExistsItems.length === 1;
    const isMoveMode = mode === 'move';

    // 중복 알약이 속한 고유 대상 폴더 이름 목록 추출
    const targetFolderNames = Array.from(
      new Set(
        alreadyExistsItems
          .map((item) => {
            if (item.folderName) return item.folderName;
            if (item.folderId) {
              const matched = folders.find((f) => f.id === item.folderId);
              if (matched) return matched.name;
            }
            return '';
          })
          .filter(Boolean),
      ),
    );

    const firstFolderName =
      targetFolderNames[0] ||
      folders.find((f) => selectedIds.includes(f.id))?.name ||
      '선택한 폴더';

    const folderCount = targetFolderNames.length;
    const folderText =
      folderCount > 1
        ? `'${firstFolderName}' 외 ${folderCount - 1}개 폴더`
        : `'${firstFolderName}' 폴더`;

    let message: string;

    if (isMoveMode) {
      message = isOnlyOne
        ? `${alreadyExistsItems[0].name}은(는) ${folderText}에 이미 존재하여 이동되지 않았습니다.`
        : `${alreadyExistsItems[0].name} 외 ${alreadyExistsItems.length - 1}개는 ${folderText}에 이미 존재하여 이동되지 않았습니다.`;
    } else {
      message = isOnlyOne
        ? `${alreadyExistsItems[0].name}은(는) ${folderText}에 이미 존재합니다.`
        : `${alreadyExistsItems[0].name} 외 ${alreadyExistsItems.length - 1}개는 ${folderText}에 이미 존재합니다.`;
    }

    showToast({
      type: 'default',
      message,
    });
  };

  // 실제 저장/이동/복사 실행 (확인 후 공통 로직)
  const executeSave = async () => {
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

    const isLimitExceeded = !pillLimitValidation.isValid;

    if (isLimitExceeded) {
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

      const isMoveMode = mode === 'move';
      const isCopyMode = mode === 'copy';
      const hasDuplicate = alreadyExistsItems.length > 0;

      if (hasDuplicate) {
        // 이동/복사 모드: 이동된 항목이 있으면 성공 토스트와 함께, 전부 중복이면 중복 토스트만
        const totalCount = items ? items.length : 1;
        const duplicateCount = alreadyExistsItems.length;
        const movedCount = totalCount - duplicateCount;

        if (isMoveMode && movedCount > 0) {
          showToast({ type: 'default', message: '이동되었습니다.' });
        }

        showAlreadyExistsToast(alreadyExistsItems);
      } else {
        if (isMoveMode) {
          showToast({ type: 'default', message: '이동되었습니다.' });
        } else if (isCopyMode) {
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

  // 저장 버튼 클릭 핸들러
  const handleSave = () => {
    void executeSave();
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
