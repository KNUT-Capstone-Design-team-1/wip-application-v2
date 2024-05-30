import { screenState } from "@/atoms/screen";
import Layout from "@/components/organisms/Layout";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRecoilState } from "recoil";
import ArrowRightSvg from '@assets/svgs/arrow_right_bold.svg';
import { font, os } from "@/style/font";
import { getItem, setItem } from "@/utils/storage";

const Settings = (): JSX.Element => {
    const nav: any = useNavigation();
    const [screen, setScreen]: any = useRecoilState(screenState);
    const [storageLength, setStorageLength] = useState<string | undefined>(undefined);

    const handleSetScreen = () => {
        setScreen('설정');
    }

    const getStorage = async () => {
        const LIST = await getItem('pillStorage');
        if (LIST) {
            setStorageLength(JSON.parse(LIST).length + '개');
        } else {
            setStorageLength(0 + '개');
        }
    }

    const handlePressTerm = () => {
        nav.push('이용약관');
    }

    const handlePressStorageReset = () => {
        Alert.alert('보관함 초기화', `정말로 보관함을 '초기화'하시겠습니까?`, [
            {
                text: '취소',
                style: 'cancel',
            },
            { text: '초기화', onPress: () => handleResetStorage() },
        ]);
    }

    const handlePressHistoryReset = () => {
        Alert.alert('기록 삭제', `정말로 기록을 '삭제'하시겠습니까?`, [
            {
                text: '취소',
                style: 'cancel',
            },
            { text: '삭제', onPress: () => handleResetHistory() },
        ]);
    }

    const handleResetStorage = () => {
        setItem('pillStorage', '');
        getStorage();
    }

    const handleResetHistory = () => {
        setItem('latestSearchPill', '');
    }

    useEffect(() => {
        nav.addListener('focus', () => handleSetScreen());
        return () => {
            nav.removeListener('focus', () => handleSetScreen());
        }
    }, []);

    useFocusEffect(() => {
        getStorage();
    });

    const styles = StyleSheet.create({
        scrollViewWrapper: {
            flex: 1,
            backgroundColor: '#fff',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            paddingTop: 8,
        },
        viewWrapper: {
            flex: 1,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            overflow: 'hidden',
            backgroundColor: 'white',
            paddingHorizontal: 15,
        },
        settingItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 18,
            paddingHorizontal: 28,
        },
        settingItemLabel: {
            flex: 1,
            color: '#000',
            fontSize: font(18),
            fontFamily: os.font(400, 400),
            includeFontPadding: false,
            paddingBottom: 0,
        },
        warningText: {
            color: '#b81b1b',
        },
        settingItemText: {
            color: '#000',
            fontSize: font(18),
            fontFamily: os.font(400, 400),
            includeFontPadding: false,
            paddingBottom: 0,
        },
        subText: {
            color: '#aaa',
        },
        rightArrow: {
        },
    });

    return (
        <Layout.default>
            <ScrollView style={styles.scrollViewWrapper}>
                <View style={styles.settingItem}>
                    <Text style={styles.settingItemLabel}>앱 버전</Text>
                    <Text style={styles.settingItemText}>v2.0</Text>
                </View>
                <TouchableOpacity style={styles.settingItem} onPress={handlePressTerm}>
                    <Text style={styles.settingItemLabel}>이용약관</Text>
                    <ArrowRightSvg style={styles.rightArrow} width={12} height={16} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingItem} onPress={handlePressHistoryReset}>
                    <Text style={[styles.settingItemLabel, styles.warningText]}>기록 삭제</Text>
                    <ArrowRightSvg style={styles.rightArrow} width={12} height={16} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingItem} onPress={handlePressStorageReset}>
                    <Text style={[styles.settingItemLabel, styles.warningText]}>보관함 초기화</Text>
                    <Text style={[styles.settingItemText, styles.subText]}>{storageLength ?? ' - 개'}</Text>
                </TouchableOpacity>
            </ScrollView>
        </Layout.default>
    )
}

export default Settings;