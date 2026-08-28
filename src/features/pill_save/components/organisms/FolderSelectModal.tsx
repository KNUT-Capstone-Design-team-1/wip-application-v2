import React from 'react';
import { View, Modal, FlatList, TouchableOpacity } from 'react-native';
import { styles } from '@features/pill_save/styles/organisms/FolderSelectModal';
import { px } from '@utils/responsive';

import { FolderSelectModalHeader } from '@features/pill_save/components/molecules/FolderSelectModalHeader';
import { FolderSelectListItem } from '@features/pill_save/components/molecules/FolderSelectListItem';
import { AddFolderSection } from '@features/pill_save/components/molecules/AddFolderSection';
import { SaveActionBtn } from '@features/pill_save/components/atoms/SaveActionBtn';
import { useFolderSelectModal } from '@features/pill_save/hooks/use_folder_select_modal';

import { IFolderSelectModalProps } from '@features/pill_save/types/pill_save_type';

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

  // 모달 닫기 핸들러
  const handleClose = () => {
    if (isSaving) return;
    props.onClose();
  };

  return (
    <Modal
      visible={props.isVisible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={handleClose}
      >
        <View style={styles.bottomSheet} onStartShouldSetResponder={() => true}>
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

          <View style={{ paddingHorizontal: px(20), flexShrink: 1 }}>
            <FlatList
              data={folders}
              keyExtractor={(item) => item.id.toString()}
              style={styles.list}
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

            <SaveActionBtn isSaving={isSaving} onPress={handleSave} />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default FolderSelectModal;
