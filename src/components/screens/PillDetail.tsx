import { screenState } from "@/atoms/screen";
import Button from "@/components/atoms/Button";
import Layout from "@/components/organisms/Layout";
import { font, os } from "@/style/font";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Image, Text } from "react-native";
import { useRecoilState } from "recoil";
import AddStorageSvg from '@assets/svgs/addStorage.svg';
import ShareSvg from '@assets/svgs/share.svg';
import ArrowDownSvg from '@assets/svgs/dropdown.svg';
import { getItem, setItem } from "@/utils/storage";
import { parseXML } from "@/utils/xml";
import { DETAIL_DATA } from "@/constans/mock";
import Config from "react-native-config";
import axios from "axios";
import LoadingCircle from "@/components/atoms/LoadingCircle";
import Toast from "react-native-toast-message";

const PillDetail = ({ route }: any): JSX.Element => {
    const nav: any = useNavigation();
    const [screen, setScreen]: any = useRecoilState(screenState);
    const [isStorage, setIsStorage] = useState<boolean>(false);
    const [infoData, setInfoData] = useState<any>({ EE: [''], UD: [''], NB: [''] });
    const [loading, setLoading] = useState<boolean>(true);
    const [info1, setInfo1] = useState<boolean>(true);
    const [info2, setInfo2] = useState<boolean>(true);
    const [info3, setInfo3] = useState<boolean>(true);
    const data = route.params.data;

    const handleSetScreen = () => {
        setScreen('알약 정보');
    }

    const handlePressAddStorage = async () => {
        const LIST = await getItem('pillStorage');
        let list = [];
        if (LIST) {
            list = JSON.parse(LIST);
            if (!!list.find((i: any) => i._id === data._id)) {
                let tempList: any[] = [];
                list.map((i: any) => {
                    if (i._id !== data._id) {
                        tempList.push(i)
                    }
                })
                list = tempList;
            } else {
                list.push(data);
            }
        } else {
            list.push(data);
        }
        await setItem('pillStorage', JSON.stringify(list));
        await getStorageList();
    }

    /** 알약 보관함에 해당 알약이 있는지 확인 */
    const getStorageList = async () => {
        const LIST = await getItem('pillStorage');
        let list = [];
        if (LIST) {
            list = JSON.parse(LIST);
            setIsStorage(!!list.find((i: any) => i._id === data._id));
        }
    }

    const getDetailData = async () => {
        const URL = Config.API_URL + '/pill-search/detail?skip=0&limit=20';
        const itemSeq = data.ITEM_SEQ;
        setLoading(true);
        let parsedData = { EE: [''], UD: [''], NB: [''] };
        await axios.post(URL, { ITEM_SEQ: '201100488' }, { timeout: 10000 }).then((res) => {
            console.log(data.ITEM_SEQ, res.data.data);
            if (res.data.success) {
                parsedData = {
                    EE: parseXML(res.data.data[0].EE_DOC_DATA),
                    UD: parseXML(res.data.data[0].UD_DOC_DATA),
                    NB: parseXML(res.data.data[0].NB_DOC_DATA),
                }
            }
            setInfoData(parsedData);
            setLoading(false);
        }).catch((err) => {
            console.log(err);
            setLoading(false);
            Toast.show({
                type: 'errorToast',
                text1: '상세검색을 가져오는데 문제가 생겼습니다.',
            });
            // [임시]
            //setLoading(false);
            //setInfoData(getMockData());
        });
    }

    // [임시] 테스트를 위한 MockData
    const getMockData = () => {
        const data = DETAIL_DATA.data[0];
        let parsedData = {
            EE: parseXML(data.EE_DOC_DATA),
            UD: parseXML(data.UD_DOC_DATA),
            NB: parseXML(data.NB_DOC_DATA),
        }

        return parsedData;
    }

    const handlePressDropdown = (func: any) => {
        func((prev: boolean) => !prev);
    }

    useEffect(() => {
        nav.addListener('focus', () => handleSetScreen());
        return () => {
            nav.removeListener('focus', () => handleSetScreen());
        }
    }, []);

    useEffect(() => {
        getStorageList();
        getDetailData();
    }, [route]);

    useEffect(() => {
        if (infoData)
            console.log(infoData.EE);
    }, [infoData])

    const styles = StyleSheet.create({
        scrollViewWrapper: {
            flex: 1,
            backgroundColor: '#fff',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
        },
        viewWrapper: {
            flex: 1,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            overflow: 'hidden',
            backgroundColor: 'white',
            paddingHorizontal: 15,
        },
        pillImgWrapper: {
            width: '100%',
            aspectRatio: '1299/709',
            borderRadius: 18,
            overflow: 'hidden',
            marginTop: 16,
        },
        pillImg: {
            width: '100%',
            height: '100%',
            borderRadius: 18,
            overflow: 'hidden',
        },
        name: {
            flex: 1,
            color: '#000',
            fontSize: font(22),
            fontFamily: os.font(700, 700),
            includeFontPadding: false,
            paddingBottom: 0,
            paddingRight: 20,
        },
        infoContainer: {

        },
        nameWrapper: {
            position: 'relative',
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginTop: 16,
        },
        buttonWrapper: {
            flexDirection: 'row',
            marginRight: -4,
        },
        button: {
            padding: 8,
            paddingHorizontal: 14,
        },
        addStorageActive: {
            opacity: 0.3,
        },
        detailInfoContainer: {
            paddingBottom: 200,
        },
        detailInfoWrapper: {
        },
        detailInfoHeadWrapper: {
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
        },
        detailInfoHeadText: {
            color: '#3c42ec',
            fontSize: font(20),
            fontFamily: os.font(700, 700),
            includeFontPadding: false,
            paddingBottom: 6,
        },
        detailInfoContentsText: {
            color: '#000000',
            fontSize: font(18),
            fontFamily: os.font(400, 400),
            includeFontPadding: false,
            paddingBottom: 2,
        },
        detailInfoContents: {
            gap: 10,
            marginBottom: 16,
        },
        infoWrapper: {
            gap: 6,
            paddingVertical: 12,
            marginBottom: 12,
            borderBottomWidth: 1.5,
            borderBottomColor: '#eee'
        },
        info: {
            flexDirection: 'row',
        },
        infoHeadText: {
            color: '#000',
            fontSize: font(16),
            fontFamily: os.font(500, 500),
            includeFontPadding: false,
            paddingBottom: 0,
            minWidth: 70,
        },
        infoContentsText: {
            color: '#000',
            fontSize: font(16),
            fontFamily: os.font(400, 400),
            includeFontPadding: false,
            paddingBottom: 0,
        },
        loadingWrapper: {
            alignItems: 'center',
            justifyContent: 'center',
            height: 200,
        }
    });

    return (
        <Layout.default>
            <ScrollView style={styles.scrollViewWrapper}>
                <View style={styles.viewWrapper}>
                    <View style={styles.pillImgWrapper}>
                        {data.ITEM_IMAGE &&
                            <Image
                                style={styles.pillImg}
                                source={{ uri: data.ITEM_IMAGE }}
                                resizeMode="contain"
                            />}
                    </View>
                    <View style={styles.infoContainer}>
                        <View style={styles.nameWrapper}>
                            <Text style={styles.name}>{data.ITEM_NAME}</Text>
                            <View style={styles.buttonWrapper}>
                                <Button.scale
                                    activeScale={1.2}
                                    onPress={handlePressAddStorage}
                                >
                                    <View style={[styles.button, !isStorage && styles.addStorageActive]}>
                                        <AddStorageSvg width={22} height={18} />
                                    </View>
                                </Button.scale>
                                {/* 기능 임시 삭제
                                <Button.scale activeScale={1.2}>
                                    <View style={styles.button}>
                                        <ShareSvg width={22} height={18} />
                                    </View>
                                </Button.scale>
                                */}
                            </View>
                        </View>
                        <View style={styles.infoWrapper}>
                            <View style={styles.info}>
                                <Text style={styles.infoHeadText}>제조사</Text>
                                <Text style={styles.infoContentsText}>{data.ENTP_NAME ?? '-'}</Text>
                            </View>
                            <View style={styles.info}>
                                <Text style={styles.infoHeadText}>모양</Text>
                                <Text style={styles.infoContentsText}>{data.DRUG_SHAPE ?? '-'}</Text>
                            </View>
                            <View style={styles.info}>
                                <Text style={styles.infoHeadText}>제형</Text>
                                <Text style={styles.infoContentsText}>{data.CHARTIN ?? '-'}</Text>
                            </View>
                        </View>
                        {!loading ?
                            <View style={styles.detailInfoContainer}>
                                <Button.scale activeScale={1} onPress={() => handlePressDropdown(setInfo1)}>
                                    <View style={styles.detailInfoHeadWrapper}>
                                        <Text style={styles.detailInfoHeadText}>
                                            효능/효과
                                        </Text>
                                        <ArrowDownSvg style={{ transform: [{ rotate: info1 ? '0deg' : '180deg' }] }} width={12} height={12} />
                                    </View>
                                </Button.scale>
                                {info1 &&
                                    <View style={styles.detailInfoContents}>
                                        {infoData.EE.map((i: any, idx: number) =>
                                            <Text key={idx} style={styles.detailInfoContentsText}>{i}</Text>
                                        )}
                                    </View>
                                }
                                <Button.scale activeScale={1} onPress={() => handlePressDropdown(setInfo2)}>
                                    <View style={styles.detailInfoHeadWrapper}>
                                        <Text style={styles.detailInfoHeadText}>
                                            용법/용량
                                        </Text>
                                        <ArrowDownSvg style={{ transform: [{ rotate: info2 ? '0deg' : '180deg' }] }} width={12} height={12} />
                                    </View>
                                </Button.scale>
                                {info2 &&
                                    <View style={styles.detailInfoContents}>
                                        {infoData.UD.map((i: any, idx: number) =>
                                            <Text key={idx} style={styles.detailInfoContentsText}>{i}</Text>
                                        )}
                                    </View>
                                }
                                <Button.scale activeScale={1} onPress={() => handlePressDropdown(setInfo3)}>
                                    <View style={styles.detailInfoHeadWrapper}>
                                        <Text style={styles.detailInfoHeadText}>
                                            사용상 주의사항
                                        </Text>
                                        <ArrowDownSvg style={{ transform: [{ rotate: info3 ? '0deg' : '180deg' }] }} width={12} height={12} />
                                    </View>
                                </Button.scale>
                                {info3 &&
                                    <View style={styles.detailInfoContents}>
                                        {infoData.NB.map((i: any, idx: number) =>
                                            <Text key={idx} style={styles.detailInfoContentsText}>{i}</Text>
                                        )}
                                    </View>
                                }
                            </View>
                            :
                            <View style={styles.loadingWrapper}>
                                <LoadingCircle />
                            </View>
                        }
                    </View>
                </View>
            </ScrollView>
        </Layout.default>
    )
}

export default PillDetail;