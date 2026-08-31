import React, { useCallback, memo } from 'react';
import { View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { px } from '@utils/responsive';
import { PillSaveFolderItem } from '@features/pill_save/components/molecules/PillSaveFolderItem';
import { IPillSaveFolderListProps } from '@features/pill_save/types/pill_save_type';
import { COLOR_LINE } from '@constants/color';

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

  // 폴더 아이템 롱 클릭 핸들러
  const handleLongPress = useCallback(
    (item: any) => {
      if (isEditing || item.is_default) {
        return;
      }

      setIsEditing(true);
      toggleFolderSelection(item.id);
    },
    [isEditing, setIsEditing, toggleFolderSelection],
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
    () => (
      <View
        style={{
          height: 1,
          backgroundColor: COLOR_LINE.border,
          marginVertical: px(0),
        }}
      />
    ),
    [],
  );

  return (
    <FlashList
      data={folders}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{
        paddingHorizontal: px(12),
        paddingTop: 0,
        paddingBottom: px(100),
      }}
      renderItem={renderFolderItem}
      ItemSeparatorComponent={renderSeparator}
    />
  );
};

export default memo(PillSaveFolderList);
