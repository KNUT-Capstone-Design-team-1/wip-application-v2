import React, { memo } from 'react';
import { Pressable, ViewStyle, StyleProp } from 'react-native';
import { IconStyles, styles } from '../styles/unifiedSearchStyles';
import { Search } from 'lucide-react-native';
import { BaseText } from '@components/common/BaseText';
import { useRouter } from 'expo-router';

interface IUnifiedSearchNavigateBarProps {
  containerStyle?: StyleProp<ViewStyle>;
}

const UnifiedSearchNavigateBar = ({
  containerStyle,
}: IUnifiedSearchNavigateBarProps) => {
  const router = useRouter();

  const handleSearchBarPress = () => {
    router.push('/unified-search');
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.navigateContainer,
        containerStyle,
        {
          opacity: pressed ? 0.8 : 1,
        },
      ]}
      onPress={handleSearchBarPress}
    >
      <BaseText size={14} weight="semiBold" style={styles.navigateText}>
        검색어를 입력하세요
      </BaseText>
      <Search
        size={IconStyles['searchIcon'].size}
        color={IconStyles['searchIcon'].color}
        strokeWidth={IconStyles['searchIcon'].strokeWidth}
      />
    </Pressable>
  );
};

export default memo(UnifiedSearchNavigateBar);
