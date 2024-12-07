import Button from "@/components/atoms/Button";
import Layout from "@/components/organisms/Layout";
import { font, os } from "@/style/font";
import { useEffect, useRef, useState } from "react";
import { View, ScrollView, StyleSheet, Image, Text } from "react-native";
import AddStorageSvg from '@assets/svgs/addStorage.svg';
import ArrowDownSvg from '@assets/svgs/dropdown.svg';
import { getItem, setItem } from "@/utils/storage";
import { parseXML } from "@/utils/xml";
import { DETAIL_DATA } from "@/constants/mock";
import Config from "react-native-config";
import LoadingCircle from "@/components/atoms/LoadingCircle";
import Toast from "react-native-toast-message";
import PillInfo from "@/components/atoms/PillInfo";
import { useSetScreen } from "@/hooks/useSetScreen";
import { getDrugDetail } from "@/api/server";

interface InfoData {
    EE: string[] | null;
    UD: string[] | null;
    NB: string[] | null;
}

const PillDetail = ({ route }: any): JSX.Element => {
    useSetScreen('알약 정보');
    const infoRef = useRef<any>();
    const [isStorage, setIsStorage] = useState(false);
    const [storageList, setStorageList] = useState<any[]>([]);
    const [infoData, setInfoData] = useState<InfoData>({ EE: null, UD: null, NB: null });
    const [loading, setLoading] = useState(true);
    const [info1, setInfo1] = useState(true);
    const [info2, setInfo2] = useState(true);
    const [info3, setInfo3] = useState(true);
    const [moreInfo, setMoreInfo] = useState(false);
    const data = route.params.data;

    const handlePressAddStorage = async () => {
        if (!loading) {
            let updatedList = [...storageList];
            const existingItemIndex = updatedList.findIndex(i => i.info1.ITEM_SEQ === data.info1.ITEM_SEQ);

            if (existingItemIndex !== -1) {
                updatedList.splice(existingItemIndex, 1);
                setIsStorage(false);
            } else {
                updatedList.push({ info1: { ...data.info1 }, info2: infoData });
                setIsStorage(true);
            }

            await setItem('pillStorage', JSON.stringify(updatedList));
            setStorageList(updatedList);
        }
    };

    /** 알약 보관함에 해당 알약이 있는지 확인 */
    const getStorageList = async () => {
        const storaged = await getItem('pillStorage');
        if (storaged) {
            const list = JSON.parse(storaged);
            const currentData = list.find((i: any) => i.info1.ITEM_SEQ === data.info1.ITEM_SEQ);
            if (currentData) {
                setInfoData(currentData.info2);
                setStorageList(list);
                setLoading(false);
            } else {
                getDetailData();
            }
            setIsStorage(!!currentData);
        } else {
            getDetailData();
        }
    };
    //TODO: response 데이터의 형태 확인 &nbsp 나옴
    const getDetailData = async () => {
        const URL = `${Config.GOOGLE_CLOUD_DRUG_DETAIL_URL}`;
        const itemSeq = data.info1.ITEM_SEQ;
        await getDrugDetail(URL, itemSeq)
            .then(val => {
                const parsedData = {
                    EE: parseXML(val.data.EE_DOC_DATA),
                    UD: parseXML(val.data.UD_DOC_DATA),
                    NB: parseXML(val.data.NB_DOC_DATA),
                }

                setInfoData(parsedData)
            })
            .catch(err => {
                console.error(err);
                Toast.show({
                    type: 'errorToast',
                    text1: '상세정보를 가져오는데 문제가 생겼습니다.',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

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

    const handlePressMoreInfo = () => {
        setMoreInfo(!moreInfo);
    }

    const handlePressDropdown = (func: any) => {
        func((prev: boolean) => !prev);
    }

    useEffect(() => {
        getStorageList();
    }, [route]);

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
        emptyText: {
            color: '#aaa',
        },
        detailInfoContents: {
            gap: 10,
            marginBottom: 16,
        },
        infoWrapper: {
            gap: 6,
            paddingVertical: 12,
            paddingBottom: 0,
        },
        infoMoreBtn: {
            paddingVertical: 18,
            borderBottomWidth: 1.5,
            borderBottomColor: '#eee',
            marginBottom: 16,
        },
        infoMoreBtnText: {
            color: '#aaa',
            textAlign: 'center',
            fontSize: font(16),
            fontFamily: os.font(500, 500),
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
                        {data.info1.ITEM_IMAGE &&
                            <Image
                                style={styles.pillImg}
                                source={{ uri: data.info1.ITEM_IMAGE, cache: 'only-if-cached' }}
                                resizeMode="contain"
                            />}
                    </View>
                    <View style={styles.infoContainer}>
                        <View style={styles.nameWrapper}>
                            <Text style={styles.name}>{data.info1.ITEM_NAME}</Text>
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
                        <View style={styles.infoWrapper} ref={infoRef}>
                            <PillInfo label='제조사' ct={data.info1.ENTP_NAME} />
                            <PillInfo label='주성분' ct={data.info1.MAIN_ITEM_INGR} />
                            <PillInfo label='성상' ct={data.info1.CHART} />
                            <PillInfo label='포장 단위' ct={data.info1.PACK_UNIT} />
                            <PillInfo label='저장 방법' ct={data.info1.STORAGE_METHOD} />
                            <PillInfo label='유효 기간' ct={data.info1.VALID_TERM} />
                            {moreInfo &&
                                <>
                                    <PillInfo label='원료 성분' ct={data.info1.MATERIAL_NAME} />
                                    <PillInfo label='첨가제' ct={data.info1.INGR_NAME} />
                                    <PillInfo label='모양' ct={data.info1.DRUG_SHAPE} />
                                </>
                            }
                        </View>
                        <Button.scale onPress={handlePressMoreInfo}>
                            <View style={styles.infoMoreBtn}>
                                <Text style={styles.infoMoreBtnText}>{moreInfo ? '접기' : '더보기'}</Text>
                            </View>
                        </Button.scale>
                        {!loading ?
                            <View style={styles.detailInfoContainer}>
                                <Button.scale activeScale={1} onPress={() => handlePressDropdown(setInfo1)}>
                                    <View style={styles.detailInfoHeadWrapper}>
                                        <Text style={styles.detailInfoHeadText}>
                                            효능/효과
                                        </Text>
                                        {!!infoData.EE && <ArrowDownSvg style={{ transform: [{ rotate: info1 ? '0deg' : '180deg' }] }} width={12} height={12} />}
                                    </View>
                                </Button.scale>
                                {info1 &&
                                    <View style={styles.detailInfoContents}>
                                        {infoData.EE && infoData.EE.map((i: any, idx: number) =>
                                            <Text key={idx} style={styles.detailInfoContentsText}>{i}</Text>
                                        )}
                                        {(!infoData.EE || infoData.EE.length === 0) &&
                                            <Text style={[styles.detailInfoContentsText, styles.emptyText]}>정보 없음</Text>
                                        }
                                    </View>
                                }
                                <Button.scale activeScale={1} onPress={() => handlePressDropdown(setInfo2)}>
                                    <View style={styles.detailInfoHeadWrapper}>
                                        <Text style={styles.detailInfoHeadText}>
                                            용법/용량
                                        </Text>
                                        {!!infoData.EE && <ArrowDownSvg style={{ transform: [{ rotate: info2 ? '0deg' : '180deg' }] }} width={12} height={12} />}
                                    </View>
                                </Button.scale>
                                {info2 &&
                                    <View style={styles.detailInfoContents}>
                                        {infoData.UD && infoData.UD.map((i: any, idx: number) =>
                                            <Text key={idx} style={styles.detailInfoContentsText}>{i}</Text>
                                        )}
                                        {(!infoData.UD || infoData.UD.length === 0) &&
                                            <Text style={[styles.detailInfoContentsText, styles.emptyText]}>정보 없음</Text>
                                        }
                                    </View>
                                }
                                <Button.scale activeScale={1} onPress={() => handlePressDropdown(setInfo3)}>
                                    <View style={styles.detailInfoHeadWrapper}>
                                        <Text style={styles.detailInfoHeadText}>
                                            사용상 주의사항
                                        </Text>
                                        {!!infoData.UD && <ArrowDownSvg style={{ transform: [{ rotate: info3 ? '0deg' : '180deg' }] }} width={12} height={12} />}
                                    </View>
                                </Button.scale>
                                {info3 &&
                                    <View style={styles.detailInfoContents}>
                                        {infoData.NB && infoData.NB.map((i: any, idx: number) =>
                                            <Text key={idx} style={styles.detailInfoContentsText}>{i}</Text>
                                        )}
                                        {(!infoData.NB || infoData.NB.length === 0) &&
                                            <Text style={[styles.detailInfoContentsText, styles.emptyText]}>정보 없음</Text>
                                        }
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