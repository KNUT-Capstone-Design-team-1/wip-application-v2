import { styles } from '../../styles/organisms/PillSaveFolderList';
import React, { useCallback, memo } from 'react';
import { View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { PillSaveFolderItem } from '@features/pill_save/components/molecules/PillSaveFolderItem';
import { IPillSaveFolderListProps } from '@features/pill_save/types/pill_save_type';
import { useToast } from '@hooks/use_toast';

// 폴더 보관함 화면의 리스트 컴포넌트
const PillSaveFolderList = ({
  folders,
  isEditing,
  selectedFolderIds,
  setIsEditing,
  toggleFolderSelection,
}: IPillSaveFolderListProps) => {
  const router = useRouter();

  // 폴더 아이템 클릭 핸들러
  const handlePress = useCallback(
    (item: any) => {
      if (isEditing) {
        if (item.is_default) {
          return;
        }

        toggleFolderSelection(item.id);

        return;
      }

      router.push(
        `/pill-save-folder/${item.id}?name=${encodeURIComponent(item.name)}`,
      );
    },
    [isEditing, toggleFolderSelection, router],
  );

  const { showToast } = useToast();

  // 폴더 아이템 롱 클릭 핸들러
  const handleLongPress = useCallback(
    (item: any) => {
      if (isEditing) {
        return;
      }

      if (item.is_default) {
        showToast({
          type: 'error',
          message:
            '기본 폴더는 수정할 수 없습니다. 새로운 폴더를 만들어주세요.',
        });
        return;
      }

      setIsEditing(true);
      toggleFolderSelection(item.id);
    },
    [isEditing, setIsEditing, toggleFolderSelection, showToast],
  );

  // 폴더 아이템 렌더링 함수
  const renderFolderItem = useCallback(
    ({ item }: any) => {
      const isSelected = selectedFolderIds.includes(item.id);

      return (
        <PillSaveFolderItem
          item={item}
          isEditing={isEditing}
          isSelected={isSelected}
          onPress={() => handlePress(item)}
          onLongPress={() => handleLongPress(item)}
        />
      );
    },
    [isEditing, selectedFolderIds, handlePress, handleLongPress],
  );

  // 리스트 아이템 사이 구분선(separator) 렌더링
  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  return (
    <FlashList
      data={folders}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContent}
      renderItem={renderFolderItem}
      ItemSeparatorComponent={renderSeparator}
    />
  );
};

export default memo(PillSaveFolderList);
