import React, { memo } from 'react';
import { View } from 'react-native';
import SkeletonBox from '../atoms/SkeletonBox';
import { styles } from '../../styles/organisms/PillDetailSkeleton';

const PillDetailSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* 이미지 스켈레톤 */}
      <View style={styles.imageContainer}>
        <SkeletonBox width={'90%'} height={180} borderRadius={8} />
      </View>

      {/* 정보 스켈레톤 */}
      <View style={styles.infoContainer}>
        {/* 제목 */}
        <View style={styles.titleRow}>
          <SkeletonBox width="70%" height={24} />
          <SkeletonBox width={20} height={20} />
        </View>

        {/* 정보 행들 */}
        <View style={styles.infoRows}>
          {[...Array(8)].map((_, index) => (
            <View key={index} style={styles.infoRow}>
              <SkeletonBox width={80} height={16} />
              <SkeletonBox width="60%" height={16} />
            </View>
          ))}
        </View>

        {/* 더보기 버튼 */}
        <View style={styles.moreButtonContainer}>
          <SkeletonBox width={60} height={16} />
        </View>

        {/* 섹션들 */}
        <View style={styles.sections}>
          {[...Array(3)].map((_, index) => (
            <View key={index} style={styles.section}>
              <SkeletonBox width={120} height={20} />
              <View style={styles.sectionContent}>
                <SkeletonBox width="100%" height={60} />
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default memo(PillDetailSkeleton);
