import { ISavedPillFolder } from '@services/database/types';
import { validateFolderName as baseValidateFolderName } from '@utils/validation';

export const MAX_FOLDER_COUNT = 100;
export const MAX_PILL_COUNT_PER_FOLDER = 1000;
export const MAX_FOLDER_SELECTION = 20;

/**
 * 폴더 생성 및 이름 변경 유효성 검사
 */
export const validateFolderCreation = (
  folders: ISavedPillFolder[],
  folderName: string,
  isAdding: boolean,
  targetId?: number,
): { isValid: boolean; errorMessage: string } => {
  const trimmedName = folderName.trim();

  if (!trimmedName) {
    return { isValid: false, errorMessage: '폴더 이름을 입력해주세요.' };
  }

  if (isAdding && folders.length >= MAX_FOLDER_COUNT) {
    return {
      isValid: false,
      errorMessage: `폴더는 최대 ${MAX_FOLDER_COUNT}개까지만 생성할 수 있습니다.`,
    };
  }

  for (const f of folders) {
    const isDuplicateTarget = f.name === trimmedName && f.id !== targetId;

    if (isDuplicateTarget) {
      return { isValid: false, errorMessage: '이미 존재하는 폴더 이름입니다.' };
    }
  }

  const nameValidation = baseValidateFolderName(trimmedName);
  if (!nameValidation.isValid) {
    return { isValid: false, errorMessage: nameValidation.message };
  }

  return { isValid: true, errorMessage: '' };
};

/**
 * 알약 개수 초과 유효성 검사
 */
export const validatePillLimit = (
  folders: (ISavedPillFolder & { pill_count: number })[],
  selectedIds: number[],
  itemsToAddCount: number,
): { isValid: boolean; errorMessage: string } => {
  for (const f of folders) {
    const isSelected = selectedIds.includes(f.id);

    const willExceedLimit =
      f.pill_count + itemsToAddCount > MAX_PILL_COUNT_PER_FOLDER;

    if (isSelected && willExceedLimit) {
      return {
        isValid: false,
        errorMessage: `알약 보관함 폴더 내 알약 개수는 최대 ${MAX_PILL_COUNT_PER_FOLDER}개입니다. (${f.name})`,
      };
    }
  }

  return { isValid: true, errorMessage: '' };
};

/**
 * 폴더 다중 선택 제한 유효성 검사
 */
export const validateFolderSelectionLimit = (
  currentSelectionCount: number,
  isMoveOrCopy: boolean,
): { isValid: boolean; errorMessage: string } => {
  if (isMoveOrCopy && currentSelectionCount >= MAX_FOLDER_SELECTION) {
    return {
      isValid: false,
      errorMessage: `최대 ${MAX_FOLDER_SELECTION}개의 폴더만 선택할 수 있습니다.`,
    };
  }

  return { isValid: true, errorMessage: '' };
};
