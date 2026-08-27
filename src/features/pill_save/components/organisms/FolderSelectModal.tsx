import React, { useState, useEffect } from 'react';
import { View, Modal, FlatList } from 'react-native';
import { pillSaveService } from '@features/pill_save/services/pill_save_service';
import { ISavedPillFolder } from '@services/database/types';
import { useToast } from '@hooks/use_toast';
import { styles } from '@features/pill_save/styles/organisms/FolderSelectModal';

import { FolderSelectModalHeader } from '@features/pill_save/components/molecules/FolderSelectModalHeader';
import { FolderSelectListItem } from '@features/pill_save/components/molecules/FolderSelectListItem';
import { AddFolderSection } from '@features/pill_save/components/molecules/AddFolderSection';
import { SaveActionBtn } from '@features/pill_save/components/atoms/SaveActionBtn';

interface IFolderSelectModalProps {
  isVisible: boolean;
  onClose: () => void;
  itemSeq: string;
  itemName: string;
  initialSelectedIds: number[];
  onSaveComplete: (selectedIds: number[]) => void;
}

const FolderSelectModal = ({
  isVisible,
  onClose,
  itemSeq,
  itemName,
  initialSelectedIds,
  onSaveComplete,
}: IFolderSelectModalProps) => {
  const [folders, setFolders] = useState<
    (ISavedPillFolder & { pill_count: number })[]
  >([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { showToast } = useToast();

  const loadFolders = async () => {
    const data = await pillSaveService.getFolders();
    setFolders(data);
  };

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    loadFolders();

    if (initialSelectedIds.length === 0) {
      pillSaveService.getFolders().then((data) => {
        const defaultFolder = data.find((f) => f.is_default);
        if (!defaultFolder) {
          return;
        }

        setSelectedIds([defaultFolder.id]);
      });
    } else {
      setSelectedIds(initialSelectedIds);
    }

    setIsAdding(false);
    setNewFolderName('');
    setIsSaving(false);
  }, [isVisible, initialSelectedIds]);

  const toggleFolder = (id: number) => {
    if (isSaving) {
      return;
    }

    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id],
    );
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim() || isSaving) {
      return;
    }

    const newId = await pillSaveService.createFolder(newFolderName.trim());
    if (!newId) {
      return;
    }

    await loadFolders();

    setSelectedIds((prev) => [...prev, newId]);
    setIsAdding(false);
    setNewFolderName('');
  };

  const handleSave = async () => {
    if (selectedIds.length === 0) {
      showToast({
        type: 'error',
        message: '저장할 폴더를 한 개 이상 선택해주세요.',
      });
      return;
    }

    setIsSaving(true);

    try {
      await pillSaveService.savePillToFolders(itemSeq, itemName, selectedIds);
      onSaveComplete(selectedIds);
      onClose();
    } catch (e) {
      showToast({
        type: 'error',
        message: '알약 저장 중 오류가 발생했습니다.',
      });
      setIsSaving(false);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={() => {
        if (isSaving) {
          return;
        }
        onClose();
      }}
    >
      <View style={styles.overlay}>
        <View style={styles.bottomSheet}>
          <FolderSelectModalHeader onClose={onClose} />

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
      </View>
    </Modal>
  );
};

export default FolderSelectModal;
