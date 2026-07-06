import { Image } from '@components/common/CustomImage';
import { View, TouchableOpacity, Pressable } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { styles } from '../../styles/organisms/ImagePreviewSlots';
import { CircleQuestionMark, Plus, X } from 'lucide-react-native';
import { COLOR, COLOR_GRAY } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { useCameraGuideModalStore } from '@features/pill_image_search/store/camera_guide_store';

interface ImagePreviewSlotsProps {
  frontImage: string | null;
  backImage: string | null;
  onRemove: (side: 'front' | 'back') => void;
}

const ImagePreviewSlots = ({
  frontImage,
  backImage,
  onRemove,
}: ImagePreviewSlotsProps) => {
  const setIsGuideModalVisible = useCameraGuideModalStore(
    (state) => state.setIsGuideModalVisible,
  );

  return (
    <>
      <View style={styles.container}>
        <View style={styles.titleWrapper}>
          <BaseText size={18} weight="bold" style={styles.title}>
            촬영된 이미지
          </BaseText>
          <Pressable onPress={() => setIsGuideModalVisible(true)}>
            <CircleQuestionMark
              size={fontPx(24)}
              fill={COLOR_GRAY[400]}
              color={COLOR['white']}
              strokeWidth={2}
            />
          </Pressable>
        </View>
        <View style={styles.slotsWrapper}>
          {/* 앞면 */}
          <View style={styles.slot}>
            <BaseText size={14} weight="semiBold" style={styles.label}>
              앞면
            </BaseText>
            {frontImage ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: frontImage }} style={styles.image} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => onRemove('front')}
                >
                  <X size={fontPx(24)} color={COLOR['white']} strokeWidth={2} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.emptySlot}>
                <Plus
                  size={fontPx(24)}
                  color={COLOR_GRAY[400]}
                  strokeWidth={3}
                />
              </View>
            )}
          </View>

          {/* 뒷면 */}
          <View style={styles.slot}>
            <BaseText size={14} weight="semiBold" style={styles.label}>
              뒷면
            </BaseText>
            {backImage ? (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: backImage }}
                  style={styles.image}
                  cachePolicy={'memory'}
                />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => onRemove('back')}
                >
                  <X size={fontPx(24)} color={COLOR['white']} strokeWidth={2} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.emptySlot}>
                <Plus
                  size={fontPx(24)}
                  color={COLOR_GRAY[400]}
                  strokeWidth={3}
                />
              </View>
            )}
          </View>
        </View>
      </View>
    </>
  );
};

export default ImagePreviewSlots;
