import React, { useState, useCallback } from 'react';
import { View, Pressable } from 'react-native';
import { styles } from '@features/pill_save/styles/PillSave';
import PillSaveList from '@features/pill_save/components/organisms/PillSaveList';
import { useLocalSearchParams, useFocusEffect } from 'expo-router';
import { PillSaveLoadingView } from '@features/pill_save/components/atoms/PillSaveLoadingView';
import { PillSaveCountHeader } from '@features/pill_save/components/atoms/PillSaveCountHeader';
import FolderSelectModal from '@features/pill_save/components/organisms/FolderSelectModal';
import { PillSaveEditBottomBar } from '@features/pill_save/components/organisms/PillSaveEditBottomBar';
import { usePillSaveFolderDetail } from '@features/pill_save/hooks/use_pill_save_folder_detail';
import { openStockInquiryModal } from '@features/nearby_pharmacy/hooks/use_stock_inquiry';
import { usePillReminderStore } from '@features/pill_reminder/store/pill_reminder_store';
import { PillSpecificReminderBottomSheet } from '@features/pill_reminder/components/organisms/PillSpecificReminderBottomSheet';

// 특정 알약 보관함(폴더) 내부의 알약 목록을 보여주는 상세 화면 컴포넌트
const PillSaveFolderDetail = () => {
  const { id } = useLocalSearchParams();
  const folderId = parseInt(Array.isArray(id) ? id[0] : id, 10);

  const { remindedItemSeqs, fetchRemindedItemSeqs } = usePillReminderStore();
  const [selectedPillForReminder, setSelectedPillForReminder] = useState<{
    seq: string;
    name: string;
  } | null>(null);

  useFocusEffect(
    useCallback(() => {
      fetchRemindedItemSeqs();
    }, [fetchRemindedItemSeqs]),
  );

  const {
    pillSaveData,
    loading,
    isEditing,
    selectedSeqs,
    isModalVisible,
    setIsModalVisible,
    modalMode,
    allSelected,
    toggleEdit,
    handleSelectAll,
    handleItemSelect,
    handleMove,
    handleCopy,
    handleSaveComplete,
    handleMultipleDelete,
    handleBackgroundPress,
  } = usePillSaveFolderDetail(folderId);

  const handlePressReminder = (itemSeq: string, itemName: string) => {
    setSelectedPillForReminder({ seq: itemSeq, name: itemName });
  };

  // 로딩 중일 때 조기 반환
  if (loading) {
    return <PillSaveLoadingView />;
  }

  return (
    <Pressable style={styles.container} onPress={handleBackgroundPress}>
      <View style={styles.pillSaveRoot}>
        <PillSaveCountHeader
          count={pillSaveData.length}
          isEditing={isEditing}
          onToggleEdit={toggleEdit}
          onSelectAll={handleSelectAll}
          allSelected={allSelected}
          onStockInquiry={openStockInquiryModal}
        />
        <PillSaveList
          pillSaveData={pillSaveData}
          isEditing={isEditing}
          selectedSeqs={selectedSeqs}
          onItemSelect={handleItemSelect}
          onLongPressItem={(seq) => {
            if (!isEditing) {
              toggleEdit();
              handleItemSelect(seq);
            }
          }}
          remindedItemSeqs={remindedItemSeqs}
          onPressReminder={handlePressReminder}
        />

        {isModalVisible && (
          <FolderSelectModal
            isVisible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            mode={modalMode}
            sourceId={folderId}
            items={selectedSeqs.map((seq) => {
              const found = pillSaveData.find((p) => p.ITEM_SEQ === seq);
              return { seq, name: found?.ITEM_NAME || '' };
            })}
            initialSelectedIds={[]}
            onSaveComplete={handleSaveComplete}
          />
        )}

        {isEditing && (
          <PillSaveEditBottomBar
            onMove={handleMove}
            onCopy={handleCopy}
            onDelete={handleMultipleDelete}
            selectedCount={selectedSeqs.length}
          />
        )}

        {selectedPillForReminder && (
          <PillSpecificReminderBottomSheet
            visible={!!selectedPillForReminder}
            onClose={() => setSelectedPillForReminder(null)}
            itemSeq={selectedPillForReminder.seq}
            itemName={selectedPillForReminder.name}
          />
        )}
      </View>
    </Pressable>
  );
};

export default PillSaveFolderDetail;
