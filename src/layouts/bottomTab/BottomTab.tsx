import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TAB_CONFIGS } from '@layouts/bottomTab/constants';
import { router, usePathname } from 'expo-router';
import { px } from '@utils/responsive';
import { styles } from './styles';
import { TabItem } from './TabItem';

const BottomTab = () => {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  // 현재 경로와 탭 경로를 비교하여 활성화 상태 확인
  const isTabActive = (tabPath: string) => {
    if (tabPath === '/') return pathname === '/';
    return pathname.startsWith(tabPath);
  };

  return (
    <View
      style={[
        styles.bottomTabContainer,
        { paddingBottom: Math.max(insets.bottom, px(12)) },
      ]}
    >
      <View style={styles.bottomTabList}>
        {TAB_CONFIGS.map((item, index) => {
          const isActive = isTabActive(item.path);

          const handlePress = () => {
            // 같은 route인 경우 스택 쌓지 않음
            if (isActive) return;

            // 홈으로 이동할 때는 push를 사용하여 스택의 최상단으로 보내고,
            // 다른 탭으로 이동할 때는 replace를 사용하여 현재 탭 화면을 교체합니다.
            // 이렇게 하면 어떤 탭에서든 뒤로가기를 누르면 홈으로 돌아갑니다.
            if (item.path === '/') {
              router.push('/');
            } else {
              router.replace(item.path as any);
            }
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
