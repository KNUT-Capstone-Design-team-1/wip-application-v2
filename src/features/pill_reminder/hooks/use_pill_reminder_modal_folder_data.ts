import { useState, useEffect, useCallback, useRef } from 'react';
import { IFolderTabOption } from '@features/pill_reminder/components/atoms/FolderSelectTabs';
import { pillReminderService } from '@features/pill_reminder/services/pill_reminder_service';

export interface IPillSelectOption {
  item_seq: string;
  item_name: string;
  item_image?: string;
  class_name?: string;
  entp_name?: string;
}

interface IUsePillReminderModalFolderDataProps {
  visible: boolean;
  selectedItemSeqs: string[];
  onInitialFolderDetected: (folderId: number | null) => void;
}

// 알약 선택 모달의 폴더 목록 및 폴더별 알약 데이터 로딩 커스텀 훅
export const usePillReminderModalFolderData = ({
  visible,
  selectedItemSeqs,
  onInitialFolderDetected,
}: IUsePillReminderModalFolderDataProps) => {
  const [folders, setFolders] = useState<IFolderTabOption[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [folderPills, setFolderPills] = useState<IPillSelectOption[]>([]);

  const prevVisibleRef = useRef<boolean>(false);
  const onInitialFolderDetectedRef = useRef(onInitialFolderDetected);
  onInitialFolderDetectedRef.current = onInitialFolderDetected;

  // 모달이 열릴 때(visible: false -> true)만 폴더 목록 조회 및 기본 탭 설정
  useEffect(() => {
    const isJustOpened = visible && !prevVisibleRef.current;
    prevVisibleRef.current = visible;

    if (!isJustOpened) {
      return;
    }

    const loadInitialFolders = async () => {
      try {
        const folderList = await pillReminderService.getFolders();
        setFolders(folderList);

        const hasFolders = folderList.length > 0;

        if (!hasFolders) {
          return;
        }

        // 초기 선택된 알약이 속한 폴더 감지
        const hasInitialPills = selectedItemSeqs.length > 0;

        if (hasInitialPills) {
          const firstSeq = selectedItemSeqs[0];
          const folderName =
            await pillReminderService.getFolderNameByItemSeq(firstSeq);

          const matchedFolder = folderList.find((f) => f.name === folderName);

          if (matchedFolder) {
            setSelectedFolderId(matchedFolder.id);
            onInitialFolderDetectedRef.current(matchedFolder.id);
            return;
          }
        }

        // 기본 폴더 설정
        const defaultFolder =
          folderList.find((f) => f.is_default === 1) || folderList[0];
        setSelectedFolderId(defaultFolder.id);

        if (hasInitialPills) {
          onInitialFolderDetectedRef.current(defaultFolder.id);
        } else {
          onInitialFolderDetectedRef.current(null);
        }
      } catch {
        // ignore
      }
    };

    loadInitialFolders();
  }, [visible, selectedItemSeqs]);

  // 특정 폴더 알약 목록 조회
  const loadPillsForFolder = useCallback(async (folderId: number) => {
    try {
      const pills = await pillReminderService.getPillsByFolder(folderId);
      setFolderPills(pills);
    } catch {
      setFolderPills([]);
    }
  }, []);

  // 선택된 폴더 ID 변경 시 알약 목록 재조회
  useEffect(() => {
    const shouldSkipLoad = !visible || selectedFolderId === null;

    if (shouldSkipLoad) {
      return;
    }

    loadPillsForFolder(selectedFolderId);
  }, [visible, selectedFolderId, loadPillsForFolder]);

  // 폴더 탭 전환 핸들러
  const handleSelectFolder = (newFolderId: number) => {
    const isSameFolder = newFolderId === selectedFolderId;

    if (isSameFolder) {
      return;
    }

    setSelectedFolderId(newFolderId);
  };

  return {
    folders,
    selectedFolderId,
    folderPills,
    handleSelectFolder,
  };
};
