import { imgFileState } from "@/atoms/file";
import { screenState } from "@/atoms/screen";
import ResultItem from "@/components/atoms/ResultItem";
import Layout, { StatusBarHeight, defaultHeaderHeight, windowHeight } from "@/components/organisms/Layout";
import { font, os } from "@/style/font";
import { convertImgUriToBase64, getResizeImgUri } from "@/utils/image";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useState } from "react";
import { View, StyleSheet, Platform, FlatList, Text, Image } from "react-native";
import { useRecoilState } from "recoil";
import SkeletonResultItem from "@/components/atoms/SkeletonResultItem";
import Skeleton from "@/components/atoms/Skeleton";
import Toast from "react-native-toast-message";
import Config from "react-native-config";

const SearchResult = ({ route }: any): JSX.Element => {
    const nav: any = useNavigation();
    const [screen, setScreen]: any = useRecoilState(screenState);
    const [imgFile, setImgFile]: any = useRecoilState(imgFileState);
    const [imageBase64, setImageBase64] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<any[] | undefined>(undefined);
    const mergedImgUri = route.params.data;

    const handleSetScreen = () => {
        setScreen('검색 결과');
    }

    const getResultData = async () => {
        const URL = Config.API_URL + '/pill-search/image?skip=0&limit=20';
        const base64 = imageBase64;
        setLoading(true);
        await axios.post(URL, { base64 }, { timeout: 10000 }).then((res: any) => {
            setLoading(false);
            setData(res.data.data.pillInfoList);
        })
            .catch(error => {
                nav.goBack();
                Toast.show({
                    type: 'errorToast',
                    text1: '알약검색에 실패했습니다.',
                });
            });
    }



    useEffect(() => {
        if (mergedImgUri) {
            getResizeImgUri(mergedImgUri).then((resized: string) => {
                convertImgUriToBase64(resized).then((base64String: any) => {
                    setImageBase64(base64String);
                })
            }).catch((error) => {
                console.error('Error:', error);
            });
        }
    }, [mergedImgUri])

    useEffect(() => {
        nav.addListener('focus', () => handleSetScreen());
        return () => {
            nav.removeListener('focus', () => handleSetScreen());
        }
    }, []);

    useEffect(() => {
        if (imageBase64) {
            getResultData();
        }
        setLoading(true);
    }, [imageBase64])

    const styles = StyleSheet.create({
        scrollViewWrapper: {
            flex: 1,
            backgroundColor: '#fff',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
        },
        viewWrapper: {
            minHeight: windowHeight - (defaultHeaderHeight + StatusBarHeight),
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            overflow: 'hidden',
            paddingBottom: 15 + (Platform.OS === 'ios' ? 28 : 0),
            backgroundColor: '#ffffff',
        },
        resultListWrapper: {
            paddingTop: 50,
        },
        noteWrapper: {
            position: 'absolute',
            flexDirection: 'row',
            justifyContent: 'center',
            width: '100%',
            alignItems: 'center',
            paddingTop: 20,
            paddingBottom: 12,
            backgroundColor: '#fff',
            zIndex: 10,
        },
        note: {
            color: '#000',
            textAlign: 'center',
            fontSize: font(15),
            fontFamily: os.font(500, 500),
            includeFontPadding: false,
            paddingBottom: 0,
        },
        bold: {
            fontSize: font(15),
            fontFamily: os.font(700, 700),
        },
        skeletonList: {
            paddingTop: 50,
        }
    });

    return (
        <Layout.default>
            {(!loading && data) ?
                <View style={styles.viewWrapper}>
                    <View style={styles.noteWrapper}>
                        <Text style={[styles.note, styles.bold]}>총 {data.length}개</Text>
                        <Text style={styles.note}>의 알약이 검색 되었습니다.</Text>
                    </View>
                    <FlatList
                        style={styles.resultListWrapper}
                        data={data}
                        renderItem={({ item, index }) => <ResultItem data={item} last={(data.length - 1) === index} index={index} />}
                        keyExtractor={item => item._id}
                    />
                </View>
                :
                <View style={{ width: '100%', height: '100%', backgroundColor: 'white' }}>
                    <View style={styles.noteWrapper}>
                        <Skeleton width={'60%'} height={font(15)} />
                    </View>
                    <View style={styles.skeletonList}>
                        <SkeletonResultItem />
                        <SkeletonResultItem />
                        <SkeletonResultItem />
                        <SkeletonResultItem />
                        <SkeletonResultItem />
                        <SkeletonResultItem />
                    </View>
                </View>
            }
        </Layout.default>
    )
}

export default SearchResult;