import Config from 'react-native-config';
import { font, os } from '@/style/font';
import { useEffect, useRef, useState } from 'react';
import { View, ScrollView, StyleSheet, Image, Text } from 'react-native';
import Toast from 'react-native-toast-message';

import AddStorageSvg from '@assets/svgs/addStorage.svg';
import ArrowDownSvg from '@assets/svgs/dropdown.svg';
import { DETAIL_DATA } from '@/constants/mock';
import { useSetScreen } from '@/hooks/useSetScreen';
import { usePillBox } from '@/hooks/usePillBox';
import { getDrugDetail } from '@/api/server';
import { deepCopyRealmObj } from '@/utils/converter';
import { parseXML } from '@/utils/xml';
import Button from '@/components/atoms/Button';
import LoadingCircle from '@/components/atoms/LoadingCircle';
import PillInfo from '@/components/atoms/PillInfo';
import { PillDetailSection } from '@/components/atoms/PillDetailSection';
import Layout from '@/components/organisms/Layout';

interface InfoData {
  EE?: string[] | null | undefined;
  UD?: string[] | null | undefined;
  NB?: string[] | null | undefined;
}

const PillDetail = ({ route }: any): JSX.Element => {
  useSetScreen('알약 정보');
  const { addPill, getPill, delPill } = usePillBox();
  const infoRef = useRef<any>();
  const [isStorage, setIsStorage] = useState(false);
  const [infoData, setInfoData] = useState<InfoData>({
    EE: null,
    UD: null,
    NB: null,
  });
  const [loading, setLoading] = useState(true);
  const [info1, setInfo1] = useState(true);
  const [info2, setInfo2] = useState(true);
  const [info3, setInfo3] = useState(true);
  const [moreInfo, setMoreInfo] = useState(false);
  const data = route.params.data;

  const handlePressAddStorage = () => {
    if (!loading) {
      const existPillData = getPill(data.ITEM_SEQ);

      if (existPillData) {
        delPill(data.ITEM_SEQ);
        setIsStorage(false);
      } else {
        addPill({ ...data, infoData: infoData });
        setIsStorage(true);
      }
    }
  };

  /** 알약 보관함에 해당 알약이 있는지 확인 */
  const getDataFromPillBox = () => {
    const pill = getPill(data.ITEM_SEQ);
    if (pill) {
      if (pill.infoData) {
        const parsedData = deepCopyRealmObj(pill.infoData);
        setInfoData(parsedData);
      }
      setIsStorage(true);
      setLoading(false);
    } else {
      getDetailData();
    }
  };

  const getDetailData = async () => {
    const URL = `${Config.GOOGLE_CLOUD_DRUG_DETAIL_URL}`;
    const itemSeq = data.ITEM_SEQ;
    await getDrugDetail(URL, itemSeq)
      .then((val) => {
        const parsedData = {
          EE: parseXML(val.data.EE_DOC_DATA),
          UD: parseXML(val.data.UD_DOC_DATA),
          NB: parseXML(val.data.NB_DOC_DATA),
        };

        setInfoData(parsedData);
      })
      .catch((err) => {
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
    };

    return parsedData;
  };

  const handlePressMoreInfo = () => {
    setMoreInfo(!moreInfo);
  };

  const handlePressDropdown = (func: any) => {
    func((prev: boolean) => !prev);
  };

  useEffect(() => {
    getDataFromPillBox();
  }, [route]);

  return (
    <Layout.default>
      <ScrollView style={styles.scrollViewWrapper}>
        <View style={styles.viewWrapper}>
          <View style={styles.pillImgWrapper}>
            {data.ITEM_IMAGE && (
              <Image
                style={styles.pillImg}
                source={{ uri: data.ITEM_IMAGE, cache: 'only-if-cached' }}
                resizeMode="contain"
              />
            )}
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.nameWrapper}>
              <Text style={styles.name}>{data.ITEM_NAME}</Text>
              <View style={styles.buttonWrapper}>
                <Button.scale
                  activeScale={1.2}
                  onPress={handlePressAddStorage}
                  disabled={loading}
                >
                  <View
                    style={[
                      styles.button,
                      !isStorage && styles.addStorageActive,
                    ]}
                  >
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
              <PillInfo.default label="제조사" ct={data.ENTP_NAME} />
              <PillInfo.default label="주성분" ct={data.MAIN_ITEM_INGR} />
              <PillInfo.default label="분류명" ct={data.CLASS_NAME} />
              <PillInfo.default label="제형" ct={data.DRUG_SHAPE} />
              <PillInfo.default label="성상" ct={data.CHART} />
              <PillInfo.chip
                label="식별 문자"
                ct={[data.PRINT_FRONT, data.PRINT_BACK]}
              />
              <PillInfo.default label="포장 단위" ct={data.PACK_UNIT} />
              <PillInfo.default label="유효 기간" ct={data.VALID_TERM} />
              {moreInfo && (
                <>
                  <PillInfo.default
                    label="원료 성분"
                    ct={data.MATERIAL_NAME.replaceAll(';', '\n')}
                    searchValue="|"
                    replaceValue="/"
                  />
                  <PillInfo.default label="첨가제" ct={data.INGR_NAME} />
                  <PillInfo.default
                    label="저장 방법"
                    ct={data.STORAGE_METHOD}
                  />
                </>
              )}
            </View>
            <Button.scale onPress={handlePressMoreInfo}>
              <View style={styles.infoMoreBtn}>
                <Text style={styles.infoMoreBtnText}>
                  {moreInfo ? '접기' : '더보기'}
                </Text>
              </View>
            </Button.scale>
            {!loading ? (
              <View style={styles.detailInfoContainer}>
                <Button.scale
                  activeScale={1}
                  onPress={() => handlePressDropdown(setInfo1)}
                >
                  <View style={styles.detailInfoHeadWrapper}>
                    <Text style={styles.detailInfoHeadText}>효능/효과</Text>
                    {!!infoData.EE && (
                      <ArrowDownSvg
                        style={{
                          transform: [{ rotate: info1 ? '0deg' : '180deg' }],
                        }}
                        width={12}
                        height={12}
                      />
                    )}
                  </View>
                </Button.scale>
                {info1 && <PillDetailSection parsedData={infoData.EE} />}
                <Button.scale
                  activeScale={1}
                  onPress={() => handlePressDropdown(setInfo2)}
                >
                  <View style={styles.detailInfoHeadWrapper}>
                    <Text style={styles.detailInfoHeadText}>용법/용량</Text>
                    {!!infoData.EE && (
                      <ArrowDownSvg
                        style={{
                          transform: [{ rotate: info2 ? '0deg' : '180deg' }],
                        }}
                        width={12}
                        height={12}
                      />
                    )}
                  </View>
                </Button.scale>
                {info2 && <PillDetailSection parsedData={infoData.UD} />}
                <Button.scale
                  activeScale={1}
                  onPress={() => handlePressDropdown(setInfo3)}
                >
                  <View style={styles.detailInfoHeadWrapper}>
                    <Text style={styles.detailInfoHeadText}>
                      사용상 주의사항
                    </Text>
                    {!!infoData.UD && (
                      <ArrowDownSvg
                        style={{
                          transform: [{ rotate: info3 ? '0deg' : '180deg' }],
                        }}
                        width={12}
                        height={12}
                      />
                    )}
                  </View>
                </Button.scale>
                {info3 && <PillDetailSection parsedData={infoData.NB} />}
              </View>
            ) : (
              <View style={styles.loadingWrapper}>
                <LoadingCircle />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </Layout.default>
  );
};

const styles = StyleSheet.create({
  addStorageActive: { opacity: 0.3 },
  button: { padding: 8, paddingHorizontal: 14 },
  buttonWrapper: { flexDirection: 'row', marginRight: -4 },
  detailInfoContainer: { paddingBottom: 200 },
  detailInfoHeadText: {
    color: '#3c42ec',
    fontFamily: os.font(700, 700),
    fontSize: font(20),
    includeFontPadding: false,
    paddingBottom: 6,
  },
  detailInfoHeadWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  infoContainer: {},
  infoMoreBtn: {
    borderBottomColor: '#eee',
    borderBottomWidth: 1.5,
    marginBottom: 16,
    paddingVertical: 18,
  },
  infoMoreBtnText: {
    color: '#aaa',
    fontFamily: os.font(500, 500),
    fontSize: font(16),
    includeFontPadding: false,
    paddingBottom: 0,
    textAlign: 'center',
  },
  infoWrapper: { gap: 6, paddingBottom: 0, paddingVertical: 12 },
  loadingWrapper: {
    alignItems: 'center',
    height: 200,
    justifyContent: 'center',
  },
  name: {
    color: '#000',
    flex: 1,
    fontFamily: os.font(700, 700),
    fontSize: font(22),
    includeFontPadding: false,
    paddingBottom: 0,
    paddingRight: 20,
  },
  nameWrapper: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginTop: 16,
    position: 'relative',
  },
  pillImg: {
    borderRadius: 18,
    height: '100%',
    overflow: 'hidden',
    width: '100%',
  },
  pillImgWrapper: {
    aspectRatio: '1299/709',
    borderRadius: 18,
    marginTop: 16,
    overflow: 'hidden',
    width: '100%',
  },
  scrollViewWrapper: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
  },
  viewWrapper: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
    overflow: 'hidden',
    paddingHorizontal: 15,
  },
});

export default PillDetail;
