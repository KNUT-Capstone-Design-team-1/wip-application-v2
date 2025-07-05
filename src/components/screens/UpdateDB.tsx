import Layout from "@/components/organisms/Layout";
import { useCallback, useEffect, useState } from "react";
import { Image, StyleSheet, Text, View, BackHandler, AppState } from "react-native";
import { font, os } from "@/style/font";
import * as Progress from "react-native-progress"
import { DBResClient } from "@/api/client/DBResClient";
import { formatBytes, formatDateToString, formatProgress } from "@/utils/formatter";
import RNExitApp from "react-native-exit-app"
import RNRestart from 'react-native-restart';
import { upsertDB } from "@/api/update";
import { getItem, setItem } from "@/utils/storage";
import Toast from "react-native-toast-message";
import { useAlert } from "@/hooks/useAlert";
import packageJSON from '../../../package.json';

const resourceVersion = packageJSON.config.databaseResourceVersion;

const resClient = DBResClient.getInstance();
let isExitApp = false
let timeout: NodeJS.Timeout;

const UpdateDB = (): JSX.Element => {
  const [status, setStatus] = useState('DB 업데이트 확인')
  const [progress, setProgress] = useState(0)
  const { showAlert } = useAlert()

  const handleClose = () => {
    if (!isExitApp) {
      isExitApp = true;
      Toast.show({
        type: 'noteToast',
        text1: '앱을 종료하시겠습니까?',
      })

      timeout = setTimeout(() => {
        isExitApp = false;
      }, 2000)
    } else {
      clearTimeout(timeout)
      RNExitApp.exitApp()
    }
  }

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress',
      () => {
        showAlert(
          "앱 종료",
          '앱을 종료하시겠습니까?',
          [
            {
              text: '취소',
              onPress: () => {
                return true
              },
              style: {}
            },
            {
              text: '확인',
              onPress: () => {
                RNExitApp.exitApp()
              },
              style: {}
            }
          ],
          {
            modalType: 'default'
          }
        )
        // handleClose();
        return true
      })

    const getResourceInfo = async () => {
      const lastUpdateDate = await getItem('lastUpdateDate');

      const resourceType = lastUpdateDate !== '' ? 'update' : 'initial';
      const resourceFileName = `${resourceType}_${resourceVersion}`;

      await resClient.getResourceList(resourceFileName);
      showAlert(
        "DB 업데이트",
        'DB 업데이트가 필요합니다' + `\n` + '다운로드 용량:' + formatBytes(resClient.resSize) + `\n` + '(wifi 사용권장)',
        [
          {
            text: '취소',
            onPress: () => {
              RNExitApp.exitApp()
              return true
            },
            style: {}
          },
          {
            text: '확인',
            onPress: () => {
              runUpdate();
            },
            style: {}
          }
        ],
        {
          modalType: 'exit',
          onRequestClose: handleClose
        }
      )
    }
    getResourceInfo();

    return () => {
      backHandler.remove();
    }
  }, [])

  const handleReset = async () => {
    setProgress(0)
    await resClient.clearRes();
  }

  const runUpdate = async () => {
    setStatus('DB 초기화 중')
    await handleReset();
    setStatus('리소스 다운로드 중')
    console.log('start update:', new Date().toISOString())
    await resClient.getResourceChunk(() => { setProgress((prev) => prev + 1) })
    setStatus('DB 업데이트 적용 중')
    await upsertDB((idx, total) => { setProgress((prev) => prev + ((idx) / (total))) })
    setProgress(prev => prev + 1)
    await resClient.clearRes();
    await setItem('lastUpdateDate', formatDateToString(new Date()))
    console.log('end update:', new Date().toISOString())
    RNRestart.restart();
  }

  return (
    <Layout.initscreen>
      <View style={styles.initViewWrapper}>
        <View style={styles.logoViewWrapper}>
          <Image
            style={styles.logo}
            source={require('@assets/images/logo_default.png')} />
        </View>
        <View style={styles.infoViewWrapper}>
          <Text style={styles.infoText}>{status + ' ' + formatProgress(progress, resClient.resCount)}</Text>
          <Progress.Bar
            width={200}
            height={10}
            indeterminate={progress > 0 ? false : true}
            progress={progress / resClient.resCount}
            color="#7472EB"
            unfilledColor="#fff"
            borderWidth={0}
            borderColor="#cacaca"
            useNativeDriver={true}
          />
        </View>
      </View>
    </Layout.initscreen>
  )
}

const styles = StyleSheet.create({
  initViewWrapper: {
    flex: 1,
  },
  infoViewWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontFamily: os.font(500, 500),
    fontSize: font(20),
    color: '#fff',
    marginBottom: 16
  },
  logoViewWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain'
  }
})

export default UpdateDB