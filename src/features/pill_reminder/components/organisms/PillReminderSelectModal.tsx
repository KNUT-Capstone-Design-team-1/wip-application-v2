import React from 'react';
import { View } from 'react-native';
import { BaseBottomSheet } from '@components/common/BaseBottomSheet';
import { FolderSelectTabs } from '@features/pill_reminder/components/atoms/FolderSelectTabs';
import { ModalToast } from '@features/pill_reminder/components/atoms/ModalToast';
import { PillReminderSelectHeader } from '@features/pill_reminder/components/molecules/PillReminderSelectHeader';
import { PillReminderSelectList } from '@features/pill_reminder/components/molecules/PillReminderSelectList';
import { PillReminderSelectFooter } from '@features/pill_reminder/components/molecules/PillReminderSelectFooter';
import {
  usePillReminderSelectModal,
  IPillSelectOption,
} from '@features/pill_reminder/hooks/use_pill_reminder_select_modal';
import { styles } from '@features/pill_reminder/styles/organisms/PillReminderSelectModal';

export type { IPillSelectOption };

interface IPillReminderSelectModalProps {
  visible: boolean;
  onClose: () => void;
  selectedItemSeqs: string[];
  onConfirm: (
    selectedSeqs: string[],
    folderId?: number,
    folderName?: string,
  ) => void;
}

// 알약 다중 선택 바텀시트 모달 메인 컴포넌트
export const PillReminderSelectModal = ({
  visible,
  onClose,
  selectedItemSeqs,
  onConfirm,
}: IPillReminderSelectModalProps) => {
  const {
    folders,
    selectedFolderId,
    folderPills,
    tempSelectedSeqs,
    displayedSelectedSeqs,
    isAllSelected,
    toastMessage,
    isToastVisible,
    toastOpacity,
    handleSelectFolder,
    toggleSelect,
    toggleSelectAll,
    handleConfirm,
  } = usePillReminderSelectModal({
    visible,
    selectedItemSeqs,
    onConfirm,
    onClose,
  });

  return (
    <>
      {/* 모달 내부 최상단 토스트 */}
      <ModalToast
        message={toastMessage}
        visible={isToastVisible}
        opacity={toastOpacity}
      />

      <BaseBottomSheet
        visible={visible}
        onClose={onClose}
        containerStyle={styles.bottomSheet}
        showDragHandle={true}
        enablePanDownToClose={true}
      >
        <View style={styles.contentContainer}>
          {/* 상단 헤더 (타이틀, 전체선택/해제, 닫기 버튼) */}
          <PillReminderSelectHeader
            hasPills={folderPills.length > 0}
            isAllSelected={isAllSelected}
            onToggleSelectAll={toggleSelectAll}
            onClose={onClose}
          />

          {/* 폴더 선택 가로 스크롤 탭 바 */}
          <FolderSelectTabs
            folders={folders}
            selectedFolderId={selectedFolderId}
            onSelectFolder={handleSelectFolder}
          />

          {/* 단일 알약 목록 스크롤 영역 (활성 폴더 기준 체크 표시) */}
          <PillReminderSelectList
            folderPills={folderPills}
            tempSelectedSeqs={displayedSelectedSeqs}
            onToggleSelect={toggleSelect}
          />

          {/* 하단 고정 액션 버튼 (취소, 선택 완료) */}
          <PillReminderSelectFooter
            selectedCount={tempSelectedSeqs.length}
            onCancel={onClose}
            onConfirm={handleConfirm}
          />
        </View>
      </BaseBottomSheet>
    </>
  );
};
