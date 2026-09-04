import React from 'react';
import {
  View,
  Modal,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '@features/pill_save/styles/organisms/FolderSelectModal';
import { px } from '@utils/responsive';

import { FolderSelectModalHeader } from '@features/pill_save/components/molecules/FolderSelectModalHeader';
import { FolderSelectListItem } from '@features/pill_save/components/molecules/FolderSelectListItem';
import { AddFolderSection } from '@features/pill_save/components/molecules/AddFolderSection';
import { SaveActionBtn } from '@features/pill_save/components/atoms/SaveActionBtn';
import { useFolderSelectModal } from '@features/pill_save/hooks/use_folder_select_modal';
import { BaseText } from '@components/common/BaseText';

import { IFolderSelectModalProps } from '@features/pill_save/types/pill_save_type';

// 알약을 보관할 폴더를 선택하거나 새 폴더를 추가하는 하단 모달 컴포넌트
const FolderSelectModal = (props: IFolderSelectModalProps) => {
  const insets = useSafeAreaInsets();

  const {
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
  } = useFolderSelectModal(props);

  // 모달 닫기 핸들러
  const handleClose = () => {
    if (isSaving) {
      return;
    }
    props.onClose();
  };

  return (
    <Modal
      visible={props.isVisible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={handleClose}
        >
          <View
            style={styles.bottomSheet}
            onStartShouldSetResponder={() => true}
          >
            <FolderSelectModalHeader
              title={
                props.mode === 'move'
                  ? '이동할 폴더 선택'
                  : props.mode === 'copy'
                    ? '복사할 폴더 선택'
                    : '보관함 선택'
              }
              onAddFolder={() => setIsAdding(true)}
              hideAddButton={props.mode === 'move' || props.mode === 'copy'}
            />

            <View style={styles.contentContainer}>
              {props.mode === 'move' && (
                <View style={styles.moveWarningContainer}>
                  <BaseText
                    size={13}
                    weight="medium"
                    style={styles.moveWarningText}
                  >
                    이동하면 기존 폴더에서 알약이 삭제되며, 해당 알약이 포함된
                    복용 알림에서도 제거됩니다. 알약이 모두 삭제되면 복용 알림도
                    삭제됩니다.
                  </BaseText>
                </View>
              )}

              <FlatList
                data={folders}
                keyExtractor={(item) => item.id.toString()}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                  <FolderSelectListItem
                    item={item}
                    isSelected={selectedIds.includes(item.id)}
                    isCurrentLocation={
                      (props.mode === 'move' || props.mode === 'copy') &&
                      item.id === props.sourceId
                    }
                    onPress={() => toggleFolder(item.id)}
                  />
                )}
              />

              {props.mode !== 'move' && props.mode !== 'copy' && (
                <AddFolderSection
                  isAdding={isAdding}
                  setIsAdding={setIsAdding}
                  newFolderName={newFolderName}
                  setNewFolderName={setNewFolderName}
                  handleCreateFolder={handleCreateFolder}
                />
              )}

              <View
                style={[
                  styles.footerContainer,
                  { paddingBottom: Math.max(insets.bottom, px(20)) },
                ]}
              >
                <SaveActionBtn isSaving={isSaving} onPress={handleSave} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default FolderSelectModal;
