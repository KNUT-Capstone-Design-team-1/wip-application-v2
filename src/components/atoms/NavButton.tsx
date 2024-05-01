import { screenState } from "@/atoms/screen";
import Button from "@/components/atoms/Button";
import { font, os } from "@/style/font";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { DimensionValue, StyleSheet, Text, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { useRecoilValue } from "recoil";

interface INavWrapperProps {
  iconXML: INavIcon,
  name: string,
  navName: string,
}

interface INavIcon {
  ACTIVE: INavIconInfo,
  INACTIVE: INavIconInfo,
}
interface INavIconInfo {
  XML: string,
  SIZE: INavIconSize,
  TOP?: number,
}

interface INavIconSize {
  width: DimensionValue | undefined,
  height: DimensionValue | undefined,
  top?: number,
}

const NavButton = ({ iconXML, name, navName }: INavWrapperProps) => {
  const nav: any = useNavigation();
  const screen: any = useRecoilValue(screenState);
  const [currentScreen, setCurrentScreen] = useState<string | null>(null);

  const getIconSize = () => {
    let result: INavIconSize = { width: 25, height: 25, top: 0 }

    if (navName === currentScreen) {
      result.width = iconXML.ACTIVE.SIZE.width;
      result.height = iconXML.ACTIVE.SIZE.height;
      if (!!iconXML.ACTIVE.TOP) {
        result.top = iconXML.ACTIVE.TOP;
      }
    } else {
      if (!!iconXML.INACTIVE.TOP) {
        result.top = iconXML.INACTIVE.TOP;
      }
    }

    return result;
  }

  const styles = StyleSheet.create({
    tab: {
      position: 'relative',
      flex: 1,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 12,
      paddingBottom: 10,
    },
    iconWrapper: {
      width: '100%',
      alignItems: 'center',
      //marginBottom: 6,
    },
    icon: {
      width: getIconSize().width,
      height: getIconSize().height,
      top: getIconSize().top,
    },
    label: {
      position: 'absolute',
      width: '100%',
      top: 28,
      fontSize: font(13),
      fontFamily: os.font(400, 600),
      textAlign: 'center',
      paddingBottom: 0,
      includeFontPadding: false,
    }
  });

  useEffect(() => {
    if (screen) {
      setCurrentScreen(screen);

    }
  }, [screen])

  return (
    <Button.scale
      style={styles.tab}
      onPress={() => nav.navigate(navName)}
      activeScale={1.15}
    >
      <View style={{ height: '100%' }}>
        <View style={styles.iconWrapper}>
          <View style={styles.icon}>
            <SvgXml
              xml={
                (currentScreen && currentScreen === navName)
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
  )
}

export default NavButton;