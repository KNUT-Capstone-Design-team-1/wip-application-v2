import React from 'react';
import { View, Modal, FlatList, TouchableOpacity } from 'react-native';
import { styles } from '@features/pill_save/styles/organisms/FolderSelectModal';

import { FolderSelectModalHeader } from '@features/pill_save/components/molecules/FolderSelectModalHeader';
import { FolderSelectListItem } from '@features/pill_save/components/molecules/FolderSelectListItem';
import { AddFolderSection } from '@features/pill_save/components/molecules/AddFolderSection';
import { SaveActionBtn } from '@features/pill_save/components/atoms/SaveActionBtn';
import { useFolderSelectModal } from '@features/pill_save/hooks/use_folder_select_modal';

interface IFolderSelectModalProps {
  isVisible: boolean;
  onClose: () => void;
  itemSeq?: string;
  itemName?: string;
  items?: { seq: string; name: string }[];
  mode?: 'save' | 'move' | 'copy';
  sourceId?: number;
  initialSelectedIds: number[];
  onSaveComplete: (selectedIds: number[]) => void;
}

// 알약을 보관할 폴더를 선택하거나 새 폴더를 추가하는 하단 모달 컴포넌트
const FolderSelectModal = (props: IFolderSelectModalProps) => {
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

  return (
    <Modal
      visible={props.isVisible}
      transparent
      animationType="slide"
      onRequestClose={() => {
        if (!isSaving) {
          props.onClose();
        }
      }}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={() => {
          if (!isSaving) {
            props.onClose();
          }
        }}
      >
        <View style={styles.bottomSheet} onStartShouldSetResponder={() => true}>
          <FolderSelectModalHeader onAddFolder={() => setIsAdding(true)} />

          <FlatList
            data={folders}
            keyExtractor={(item) => item.id.toString()}
            style={styles.list}
            renderItem={({ item }) => (
              <FolderSelectListItem
                item={item}
                isSelected={selectedIds.includes(item.id)}
                onPress={() => toggleFolder(item.id)}
              />
            )}
          />

          <AddFolderSection
            isAdding={isAdding}
            setIsAdding={setIsAdding}
            newFolderName={newFolderName}
            setNewFolderName={setNewFolderName}
            handleCreateFolder={handleCreateFolder}
          />

          <SaveActionBtn isSaving={isSaving} onPress={handleSave} />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default FolderSelectModal;
