import { View, Text, TouchableOpacity } from 'react-native';
import { TAB_CONFIGS } from '@/src/layouts/bottomTab/constants';
import { router, usePathname } from 'expo-router';
import { styles } from './styles';
import Svg, { Defs, LinearGradient, Stop } from 'react-native-svg';

const BottomTab = () => {
  const pathname = usePathname();

  // 현재 경로와 탭 경로를 비교하여 활성화 상태 확인
  const isTabActive = (tabPath: string) => {
    console.log('Checking tab:', tabPath, 'Current pathname:', pathname);
    if (tabPath === '/') return pathname === '/';
    return pathname.startsWith(tabPath);
  };

  return (
    <View style={styles.bottomTabContainer}>
      <View style={styles.bottomTabList}>
        {/* SVG Gradient 정의 */}
        <Svg height="0" width="0">
          <Defs>
            <LinearGradient id="iconGradient" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#137DFF" stopOpacity="1" />
              <Stop offset="1" stopColor="#32D2FF" stopOpacity="1" />
            </LinearGradient>
          </Defs>
        </Svg>

        {TAB_CONFIGS.map((item, index) => {
          const isActive = isTabActive(item.path);

          console.log(`Tab: ${item.label}, isActive:`, isActive); // 디버깅 로그

          const handlePress = () => {
            // 같은 route인 경우 스택 쌓지 않음
            if (isActive) return;
            router.push(item.path);
          };

          return (
            <TouchableOpacity
              style={[
                styles.bottomTabItem,
                isActive && styles.bottomTabItemActive,
              ]}
              key={index}
              onPress={handlePress}
            >
              <View style={styles.bottomTabIcon}>
                {item.icon(isActive)}
              </View>
              <Text
                style={[
                  styles.bottomTabLabel,
                  isActive && styles.bottomTabLabelActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default BottomTab;
