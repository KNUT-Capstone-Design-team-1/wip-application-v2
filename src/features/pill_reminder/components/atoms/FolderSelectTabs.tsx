import React, { memo } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { styles } from '@features/pill_reminder/styles/atoms/FolderSelectTabs';

export interface IFolderTabOption {
  id: number;
  name: string;
  is_default?: number;
}

interface IFolderSelectTabsProps {
  folders: IFolderTabOption[];
  selectedFolderId: number | null;
  onSelectFolder: (folderId: number) => void;
}

// 알약 선택 모달 상단 폴더 가로 스크롤 탭 바 컴포넌트
export const FolderSelectTabs = memo(
  ({ folders, selectedFolderId, onSelectFolder }: IFolderSelectTabsProps) => {
    const hasNoFolders = folders.length === 0;

    if (hasNoFolders) {
      return null;
    }

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        {folders.map((folder) => {
          const isSelected = selectedFolderId === folder.id;

          return (
            <TouchableOpacity
              key={folder.id}
              style={[styles.tabChip, isSelected && styles.tabChipActive]}
              onPress={() => onSelectFolder(folder.id)}
              activeOpacity={0.7}
            >
              <BaseText
                size={13}
                weight={isSelected ? 'bold' : 'medium'}
                style={isSelected ? styles.tabTextActive : styles.tabText}
              >
                {folder.name}
              </BaseText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  },
);

FolderSelectTabs.displayName = 'FolderSelectTabs';
