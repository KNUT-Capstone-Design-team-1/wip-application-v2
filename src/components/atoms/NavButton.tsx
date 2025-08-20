import Button from '@/components/atoms/Button';
import { useScreenStore } from '@/store/screen';
import { font, os } from '@/style/font';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { DimensionValue, StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

interface INavWrapperProps {
  iconXML: INavIcon;
  name: string;
  navName: string;
  tabName?: string;
}

interface INavIcon {
  ACTIVE: INavIconInfo;
  INACTIVE: INavIconInfo;
}
interface INavIconInfo {
  XML: string;
  SIZE: INavIconSize;
  TOP?: number;
}

interface INavIconSize {
  width: DimensionValue | undefined;
  height: DimensionValue | undefined;
  top?: number;
}

const NavButton = ({ iconXML, name, navName, tabName }: INavWrapperProps) => {
  const nav: any = useNavigation();
  const screen = useScreenStore((state) => state.screen);
  const [currentScreen, setCurrentScreen] = useState<string | null>(null);

  const getIconSize = () => {
    let result: INavIconSize = { width: 25, height: 25, top: 0 };

    if (navName === currentScreen) {
      result.width = iconXML.ACTIVE.SIZE.width;
      result.height = iconXML.ACTIVE.SIZE.height;
      if (iconXML.ACTIVE.TOP) {
        result.top = iconXML.ACTIVE.TOP;
      }
    } else {
      if (iconXML.INACTIVE.TOP) {
        result.top = iconXML.INACTIVE.TOP;
      }
    }

    return result;
  };

  const handlePressTab = () => {
    if (tabName) {
      nav.navigate(tabName, { screen: navName });
    } else {
      nav.navigate(navName);
    }
  };

  const styles = StyleSheet.create({
    icon: {
      height: getIconSize().height,
      top: getIconSize().top,
      width: getIconSize().width,
    },
    iconWrapper: {
      alignItems: 'center',
      width: '100%',
      //marginBottom: 6,
    },
    label: {
      color: '#000',
      fontFamily: os.font(400, 500),
      fontSize: font(13),
      includeFontPadding: false,
      paddingBottom: 0,
      position: 'absolute',
      textAlign: 'center',
      top: 28,
      width: '100%',
    },
    tab: {
      alignItems: 'center',
      flex: 1,
      height: 50,
      justifyContent: 'center',
      paddingBottom: 10,
      paddingTop: 12,
      position: 'relative',
    },
  });

  useEffect(() => {
    if (screen) {
      setCurrentScreen(screen);
    }
  }, [screen]);

  return (
    <Button.scale
      style={styles.tab}
      onPress={handlePressTab}
      activeScale={1.15}
    >
      <View style={{ height: '100%' }}>
        <View style={styles.iconWrapper}>
          <View style={styles.icon}>
            <SvgXml
              xml={
                currentScreen && currentScreen === navName
                  ? iconXML.ACTIVE.XML
                  : iconXML.INACTIVE.XML
              }
              width="100%"
              height="100%"
            />
          </View>
        </View>
        <Text style={styles.label}>{name}</Text>
      </View>
    </Button.scale>
  );
};

export default NavButton;
