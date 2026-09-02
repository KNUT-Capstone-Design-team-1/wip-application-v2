import React from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { usePillReminderSettingForm } from '@features/pill_reminder/hooks/use_pill_reminder_setting_form';
import { SelectedPillSection } from '@features/pill_reminder/components/molecules/SelectedPillSection';
import { ReminderTimeSection } from '@features/pill_reminder/components/molecules/ReminderTimeSection';
import { DaySelector } from '@features/pill_reminder/components/atoms/DaySelector';
import { ReminderDosageSection } from '@features/pill_reminder/components/molecules/ReminderDosageSection';
import { ReminderSaveFooter } from '@features/pill_reminder/components/molecules/ReminderSaveFooter';
import { PillReminderSelectModal } from '@features/pill_reminder/components/organisms/PillReminderSelectModal';
import { TimePickerModal } from '@features/pill_reminder/components/molecules/TimePickerModal';
import { BaseText } from '@components/common/BaseText';
import { COLOR } from '@constants/color';
import { styles } from '@features/pill_reminder/styles/screens/PillReminderSetting';

// 복용 알림 설정 (생성/수정) 화면 컴포넌트
export const PillReminderSettingScreen = () => {
  const { reminderId, initialItemSeqs } = useLocalSearchParams<{
    reminderId?: string;
    initialItemSeqs?: string;
  }>();

  const {
    times,
    days,
    selectedPills,
    selectedFolderName,
    loading,
    saving,
    isEditMode,
    isFormValid,
    isPillSelectModalVisible,
    isTimePickerVisible,
    editingTime,
    setIsPillSelectModalVisible,
    setIsTimePickerVisible,
    setDays,
    handleConfirmPillSelection,
    handleRemovePill,
    handleDosageChange,
    handleOpenTimePicker,
    handleConfirmTimePicker,
    handleRemoveTime,
    handleSave,
  } = usePillReminderSettingForm({ reminderId, initialItemSeqs });

  // 로딩 상태 Early Return
  const isFormLoading = loading;

  if (isFormLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLOR.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 섹션 1: 선택한 알약 목록 (폴더명 표시) */}
        <SelectedPillSection
          selectedPills={selectedPills}
          folderName={selectedFolderName}
          onOpenSelectModal={() => setIsPillSelectModalVisible(true)}
          onRemovePill={handleRemovePill}
        />

        {/* 섹션 2: 복용 시간 설정 (클릭 시 수정, + 클릭 시 추가) */}
        <ReminderTimeSection
          times={times}
          isEditMode={isEditMode}
          onOpenTimePicker={() => handleOpenTimePicker()}
          onEditTime={(time) => handleOpenTimePicker(time)}
          onRemoveTime={handleRemoveTime}
        />

        {/* 섹션 3: 복용 요일 선택 */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <BaseText size={16} weight="bold" style={styles.sectionTitle}>
              복용 요일 선택
            </BaseText>
          </View>
          <DaySelector selectedDays={days} onChange={setDays} />
        </View>

        {/* 섹션 4: 1회 복용량 설정 */}
        <ReminderDosageSection
          selectedPills={selectedPills}
          onDosageChange={handleDosageChange}
        />
      </ScrollView>

      {/* 하단 고정 저장 버튼 푸터 */}
      <ReminderSaveFooter
        isEditMode={isEditMode}
        isFormValid={isFormValid}
        saving={saving}
        onSave={handleSave}
      />

      {/* 알약 선택 바텀시트 모달 */}
      <PillReminderSelectModal
        visible={isPillSelectModalVisible}
        onClose={() => setIsPillSelectModalVisible(false)}
        selectedItemSeqs={selectedPills.map((p) => p.item_seq)}
        onConfirm={handleConfirmPillSelection}
      />

      {/* 복용 시간 선택 및 수정 모달 */}
      <TimePickerModal
        visible={isTimePickerVisible}
        onClose={() => {
          setIsTimePickerVisible(false);
        }}
        onConfirm={handleConfirmTimePicker}
        initialTime={editingTime || undefined}
      />
    </View>
  );
};
