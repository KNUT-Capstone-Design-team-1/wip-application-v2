import { View } from 'react-native';
import { TAB_CONFIGS } from '@layouts/bottomTab/constants';
import { router, usePathname } from 'expo-router';
import { styles } from './styles';
import { TabItem } from './TabItem';

const BottomTab = () => {
  const pathname = usePathname();

  // 현재 경로와 탭 경로를 비교하여 활성화 상태 확인
  const isTabActive = (tabPath: string) => {
    if (tabPath === '/') return pathname === '/';
    return pathname.startsWith(tabPath);
  };

  return (
    <View style={styles.bottomTabContainer}>
      <View style={styles.bottomTabList}>
        {TAB_CONFIGS.map((item, index) => {
          const isActive = isTabActive(item.path);

          const handlePress = () => {
            // 같은 route인 경우 스택 쌓지 않음
            if (isActive) return;
            router.push(item.path);
          };

          return (
            <TabItem
              key={item.key || index}
              icon={item.icon(isActive)}
              label={item.label}
              isActive={isActive}
              onPress={handlePress}
              isCenter={item.isCenter}
            />
          );
        })}
      </View>
    </View>
  );
};

export default BottomTab;
