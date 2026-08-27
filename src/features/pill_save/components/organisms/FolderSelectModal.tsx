import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  TextInput,
} from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { COLOR, COLOR_BG, COLOR_TEXT } from '@constants/color';
import { px, fontPx } from '@utils/responsive';
import { pillSaveService } from '@features/pill_save/services/pill_save_service';
import { ISavedPillFolder } from '@services/database/types';
import { Check, X, Plus } from 'lucide-react-native';

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

  const loadFolders = async () => {
    const data = await pillSaveService.getFolders();
    setFolders(data);
  };

  useEffect(() => {
    if (isVisible) {
      loadFolders();
      // If none selected, default to '기본' folder (which should be the one with is_default = 1)
      if (initialSelectedIds.length === 0) {
        pillSaveService.getFolders().then((data) => {
          const defaultFolder = data.find((f) => f.is_default);
          if (defaultFolder) setSelectedIds([defaultFolder.id]);
        });
      } else {
        setSelectedIds(initialSelectedIds);
      }
      setIsAdding(false);
      setNewFolderName('');
    }
  }, [isVisible, initialSelectedIds]);

  const toggleFolder = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id],
    );
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    const newId = await pillSaveService.createFolder(newFolderName.trim());
    if (newId) {
      await loadFolders();
      setSelectedIds((prev) => [...prev, newId]);
      setIsAdding(false);
      setNewFolderName('');
    }
  };

  const handleSave = async () => {
    await pillSaveService.savePillToFolders(itemSeq, itemName, selectedIds);
    onSaveComplete(selectedIds);
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.bottomSheet}>
          <View style={styles.header}>
            <BaseText size={18} weight="bold" style={styles.title}>
              폴더 선택
            </BaseText>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={fontPx(24)} color={COLOR_TEXT['title']} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={folders}
            keyExtractor={(item) => item.id.toString()}
            style={styles.list}
            renderItem={({ item }) => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <TouchableOpacity
                  style={[
                    styles.folderItem,
                    isSelected && styles.folderItemSelected,
                  ]}
                  onPress={() => toggleFolder(item.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.folderInfo}>
                    <BaseText
                      size={16}
                      weight={isSelected ? 'bold' : 'medium'}
                      style={
                        isSelected
                          ? styles.folderNameSelected
                          : styles.folderName
                      }
                    >
                      {item.name}
                    </BaseText>
                    <BaseText size={14} style={styles.folderCount}>
                      {item.pill_count}개
                    </BaseText>
                  </View>
                  {isSelected && (
                    <Check size={fontPx(20)} color={COLOR['primary']} />
                  )}
                </TouchableOpacity>
              );
            }}
          />

          {isAdding ? (
            <View style={styles.addFolderContainer}>
              <TextInput
                style={styles.addFolderInput}
                value={newFolderName}
                onChangeText={setNewFolderName}
                placeholder="새 폴더 이름"
                placeholderTextColor={COLOR_TEXT['disabled']}
                autoFocus
              />
              <TouchableOpacity
                onPress={handleCreateFolder}
                style={styles.addFolderConfirmBtn}
              >
                <BaseText
                  size={14}
                  weight="bold"
                  style={{ color: COLOR['white'] }}
                >
                  추가
                </BaseText>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addFolderBtn}
              onPress={() => setIsAdding(true)}
            >
              <Plus size={fontPx(20)} color={COLOR_TEXT['sub']} />
              <BaseText size={16} weight="medium" style={styles.addFolderText}>
                새 폴더 추가
              </BaseText>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <BaseText size={16} weight="bold" style={styles.saveBtnText}>
              저장하기
            </BaseText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLOR_BG['overlay'],
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: COLOR_BG['surface'],
    borderTopLeftRadius: px(20),
    borderTopRightRadius: px(20),
    padding: px(20),
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: px(20),
  },
  title: {
    color: COLOR_TEXT['title'],
  },
  closeBtn: {
    padding: px(4),
  },
  list: {
    maxHeight: px(300),
    marginBottom: px(16),
  },
  folderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: px(16),
    paddingHorizontal: px(12),
    borderBottomWidth: 1,
    borderBottomColor: COLOR_BG['base'],
  },
  folderItemSelected: {
    backgroundColor: '#F0F9FF',
    borderRadius: px(8),
    borderBottomWidth: 0,
  },
  folderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  folderName: {
    color: COLOR_TEXT['title'],
    marginRight: px(8),
  },
  folderNameSelected: {
    color: COLOR['primary'],
    marginRight: px(8),
  },
  folderCount: {
    color: COLOR_TEXT['sub'],
  },
  addFolderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: px(16),
    paddingHorizontal: px(12),
    marginBottom: px(16),
  },
  addFolderText: {
    color: COLOR_TEXT['sub'],
    marginLeft: px(8),
  },
  addFolderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: px(16),
    paddingHorizontal: px(12),
  },
  addFolderInput: {
    flex: 1,
    height: px(44),
    borderWidth: 1,
    borderColor: COLOR['primary'],
    borderRadius: px(8),
    paddingHorizontal: px(12),
    color: COLOR_TEXT['title'],
    fontFamily: 'Pretendard-Medium',
  },
  addFolderConfirmBtn: {
    backgroundColor: COLOR['primary'],
    height: px(44),
    justifyContent: 'center',
    paddingHorizontal: px(16),
    borderRadius: px(8),
    marginLeft: px(8),
  },
  saveBtn: {
    backgroundColor: COLOR['primary'],
    height: px(52),
    borderRadius: px(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    color: COLOR['white'],
  },
});

export default FolderSelectModal;
