import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { Image } from 'expo-image';
import { COLOR_TEXT } from '@constants/color';
import { X } from 'lucide-react-native';
import { fontPx } from '@utils/responsive';
import { ISelectedMarkPreviewProps } from '@features/pill_identification_search/types';
import { styles } from '../../styles/molecules/SelectedMarkPreview';

// 선택된 식별 마크 미리보기 컴포넌트
const SelectedMarkPreview = memo(
  ({ base64, title, onDelete }: ISelectedMarkPreviewProps) => {
    return (
      <View style={styles.markResultContainer}>
        <View style={styles.markImageWrapper}>
          <Image
            source={{ uri: base64 }}
            style={styles.markImage}
            contentFit="contain"
          />
        </View>

        <View style={styles.markTitleContainer}>
          <BaseText style={styles.markTitle} size={14} weight="bold">
            {title}
          </BaseText>
        </View>

        <TouchableOpacity style={styles.selectedMarkDelete} onPress={onDelete}>
          <X size={fontPx(18)} color={COLOR_TEXT['sub']} strokeWidth={2} />
        </TouchableOpacity>
      </View>
    );
  },
);

SelectedMarkPreview.displayName = 'SelectedMarkPreview';

export default SelectedMarkPreview;
