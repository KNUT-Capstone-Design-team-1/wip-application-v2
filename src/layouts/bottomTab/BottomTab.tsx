import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { TAB_CONFIGS } from '@layouts/bottomTab/constants';
import { px } from '@utils/responsive';
import { styles } from './styles';
import { TabItem } from './TabItem';

const BottomTab = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bottomTabContainer,
        { paddingBottom: Math.max(insets.bottom, px(12)) },
      ]}
    >
      <View style={styles.bottomTabList}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          // Find matching config for icons and labels
          const config = TAB_CONFIGS.find((c) => {
            if (route.name === 'index') return c.key === 'home';

            const normalizedPath = `/${route.name.replace(/\/index$/, '')}`;
            return c.path === normalizedPath;
          });

          if (!config) return null;

          const handlePress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <TabItem
              key={route.key}
              icon={config.icon(isFocused)}
              label={config.label}
              isActive={isFocused}
              onPress={handlePress}
              isCenter={config.isCenter}
            />
          );
        })}
      </View>
    </View>
  );
};

export default BottomTab;
