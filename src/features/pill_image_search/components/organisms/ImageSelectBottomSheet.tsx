import BaseBottomSheet from '@components/common/BaseBottomSheet';
import { BaseText } from '@components/common/BaseText';
import { useImageSelectBottomSheetActions } from '@features/pill_image_search/hooks/useImageSelectBottomSheetActions';
import { useImageSearchBottomSheetStore } from '@features/pill_image_search/store/image_search_bottom_sheet_store';
import { usePillImageActions } from '@features/pill_image_search/hooks/usePillImageActions';
import { View, Pressable } from 'react-native';
import { styles } from '@features/pill_image_search/styles/organisms/ImageSelectBottomSheet';
import { fontPx } from '@utils/responsive';
import { ChevronRight, Images } from 'lucide-react-native';
import {
  PillImageFrontIcon,
  PillImageBackIcon,
} from '@components/common/icons/PillSearchIcons';
import { COLOR, COLOR_TEXT } from '@constants/color';

const ImageSelectBottomSheet = () => {
  const isOpen = useImageSearchBottomSheetStore((state) => state.isSheetOpen);
  const sheetType = useImageSearchBottomSheetStore((state) => state.sheetType);
  const { handleBottomSheetClose } = useImageSelectBottomSheetActions();
  const { handleImageReplace } = usePillImageActions();

  const handleSelectOption = async (side?: 'front' | 'back') => {
    const isSuccess = await handleImageReplace(sheetType, side);
    if (isSuccess) {
      handleBottomSheetClose();
    }
  };

  return (
    <BaseBottomSheet
      visible={isOpen}
      onClose={handleBottomSheetClose}
      containerStyle={styles.bottomSheetContainer}
    >
      <View style={styles.header}>
        <BaseText weight="bold" size={fontPx(14)} style={styles.title}>
          {sheetType === 'file' ? '파일에서 선택' : '앨범에서 선택'}
        </BaseText>
        <BaseText weight="medium" size={fontPx(11)} style={styles.subtitle}>
          변경할 사진의 위치를 선택해 주세요.
        </BaseText>
      </View>

      <View style={styles.actionList}>
        {/* 전체 사진 다시 선택 */}
        <Pressable
          style={({ pressed }) => [
            styles.actionCard,
            pressed && styles.actionCardPressed,
          ]}
          onPress={() => handleSelectOption()}
        >
          <View style={styles.iconContainer}>
            <Images size={fontPx(16)} color={COLOR['secondary']} />
          </View>
          <View style={styles.textContainer}>
            <BaseText
              weight="bold"
              size={fontPx(14)}
              style={styles.actionTitle}
            >
              전체 사진 다시 선택
            </BaseText>
          </View>
          <ChevronRight
            size={fontPx(14)}
            color={COLOR_TEXT['disabled']}
            strokeWidth={fontPx(3)}
          />
        </Pressable>

        {/* 앞면 사진만 변경 */}
        <Pressable
          style={({ pressed }) => [
            styles.actionCard,
            pressed && styles.actionCardPressed,
          ]}
          onPress={() => handleSelectOption('front')}
        >
          <View style={styles.iconContainer}>
            <PillImageFrontIcon
              size={fontPx(16)}
              color={COLOR['secondary']}
              strokeWidth={fontPx(1.5)}
            />
          </View>
          <View style={styles.textContainer}>
            <BaseText
              weight="bold"
              size={fontPx(14)}
              style={styles.actionTitle}
            >
              앞면 사진만 변경
            </BaseText>
          </View>
          <ChevronRight
            size={fontPx(14)}
            color={COLOR_TEXT['disabled']}
            strokeWidth={fontPx(3)}
          />
        </Pressable>

        {/* 뒷면 사진만 변경 */}
        <Pressable
          style={({ pressed }) => [
            styles.actionCard,
            pressed && styles.actionCardPressed,
          ]}
          onPress={() => handleSelectOption('back')}
        >
          <View style={styles.iconContainer}>
            <PillImageBackIcon
              size={fontPx(16)}
              color={COLOR['secondary']}
              strokeWidth={fontPx(1.5)}
            />
          </View>
          <View style={styles.textContainer}>
            <BaseText
              weight="bold"
              size={fontPx(14)}
              style={styles.actionTitle}
            >
              뒷면 사진만 변경
            </BaseText>
          </View>
          <ChevronRight
            size={fontPx(14)}
            color={COLOR_TEXT['disabled']}
            strokeWidth={fontPx(3)}
          />
        </Pressable>
      </View>
    </BaseBottomSheet>
  );
};

export default ImageSelectBottomSheet;
