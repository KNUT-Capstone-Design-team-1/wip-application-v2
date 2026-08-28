import React, { useCallback, memo } from 'react';

import DraggableFlatList from 'react-native-draggable-flatlist';
import { useRouter } from 'expo-router';
import { px } from '@utils/responsive';
import { ISavedPillFolder } from '@services/database/types';

import { PillSaveFolderItem } from '@features/pill_save/components/molecules/PillSaveFolderItem';

interface Props {
  folders: (ISavedPillFolder & {
    pill_count: number;
    preview_images?: string[];
  })[];
  isEditing: boolean;
  editingFolderId: number | null;
  setIsEditing: (val: boolean) => void;
  setEditingFolderId: (id: number | null) => void;
  updateFoldersOrder: (data: any[]) => void;
}

// 폴더 보관함 화면의 드래그 가능한 리스트 컴포넌트
const PillSaveFolderList = ({
  folders,
  isEditing,
  editingFolderId,
  setIsEditing,
  setEditingFolderId,
  updateFoldersOrder,
}: Props) => {
  const router = useRouter();

  // 폴더 아이템 렌더링 함수
  const renderFolderItem = useCallback(
    ({ item, drag }: any) => {
      // 투명도 처리 (편집 중이면서 선택되지 않은 항목)
      const opacityStyle =
        isEditing && editingFolderId && editingFolderId !== item.id ? 0.5 : 1;

      return (
        <PillSaveFolderItem
          item={item}
          onPress={() => {
            if (isEditing) {
              return;
            }

            router.push(
              `/pill-save-folder/${item.id}?name=${encodeURIComponent(item.name)}`,
            );
          }}
          onLongPress={() => {
            setIsEditing(true);
            setEditingFolderId(item.id);
          }}
          isEditing={isEditing}
          drag={drag}
          opacity={opacityStyle}
        />
      );
    },
    [isEditing, editingFolderId, router, setIsEditing, setEditingFolderId],
  );

  return (
    <DraggableFlatList
      data={folders}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ padding: px(20), paddingBottom: px(100) }}
      onDragEnd={({ data }) => updateFoldersOrder(data)}
      renderItem={renderFolderItem}
    />
  );
};

export default memo(PillSaveFolderList);
