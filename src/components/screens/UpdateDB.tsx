import Layout from '@/components/organisms/Layout';
import { useCallback, useEffect, useReducer } from 'react';
import { Image, StyleSheet, Text, View, BackHandler } from 'react-native';
import { font, os } from '@/style/font';
import * as Progress from 'react-native-progress';
import { DBResClient } from '@/api/client/DBResClient';
import {
  formatBytes,
  formatDateToString,
  formatProgress,
} from '@/utils/formatter';
import { exitApp } from '@logicwind/react-native-exit-app';
import RNRestart from 'react-native-restart';
import { upsertDB } from '@/api/update';
import { getItem, setItem } from '@/utils/storage';
import Toast from 'react-native-toast-message';
import { useAlert } from '@/hooks/useAlert';
import { GLOBAL_STATE } from '@/global_state';

const resClient = DBResClient.getInstance();
let isExitApp = false;
let timeout: NodeJS.Timeout;

type UpdateDBState = {
  status: string;
  progress: number;
};

type UpdateDBAction =
  | { type: 'setStatus'; payload: string }
  | { type: 'setProgress'; payload: number };

const initialState: UpdateDBState = {
  status: 'DB 업데이트 확인',
  progress: 0,
};

function updateDBReducer(
  state: UpdateDBState,
  action: UpdateDBAction,
): UpdateDBState {
  switch (action.type) {
    case 'setStatus':
      return { ...state, status: action.payload };
    case 'setProgress':
      return { ...state, progress: action.payload };
    default:
      return state;
  }
}

const UpdateDB = (): React.JSX.Element => {
  const [state, dispatch] = useReducer(updateDBReducer, initialState);
  const { showAlert } = useAlert();

  const handleReset = async () => {
    dispatch({ type: 'setProgress', payload: 0 });
    await resClient.clearRes();
  };

  const runUpdate = useCallback(async () => {
    dispatch({ type: 'setStatus', payload: 'DB 초기화 중' });
    await handleReset();
    dispatch({ type: 'setStatus', payload: '리소스 다운로드 중' });
    console.log('start update:', new Date().toISOString());
    const resDownloadResult = await resClient.getResource((progress) => {
      dispatch({ type: 'setProgress', payload: progress });
    });
    if (!resDownloadResult.success) {
      handleUpdateFailed(
        resDownloadResult.error ?? '알 수 없는 오류가 발생했습니다.',
      );
      return;
    }
    dispatch({ type: 'setStatus', payload: 'DB 업데이트 적용 중' });
    await upsertDB();
    await resClient.clearRes();
    await setItem('lastUpdateDate', formatDateToString(new Date()));
    console.log('end update:', new Date().toISOString());
    RNRestart.restart();
  }, []);

  const handleUpdateFailed = (error: string) => {
    showAlert('데이터베이스 업데이트에 실패했습니다.', error, [
      {
        text: '확인',
        onPress: () => {
          exitApp();
        },
      },
    ]);
  };

  const handleClose = () => {
    if (!isExitApp) {
      isExitApp = true;
      Toast.show({ type: 'noteToast', text1: '앱을 종료하시겠습니까?' });

      timeout = setTimeout(() => {
        isExitApp = false;
      }, 2000);
    } else {
      clearTimeout(timeout);
      exitApp();
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        showAlert(
          '앱 종료',
          '앱을 종료하시겠습니까?',
          [
            {
              text: '취소',
              onPress: () => {
                return true;
              },
              style: {},
            },
            {
              text: '확인',
              onPress: () => {
                exitApp();
              },
              style: {},
            },
          ],
          { modalType: 'default' },
        );
        // handleClose();
        return true;
      },
    );

    const getResourceInfo = async () => {
      const lastUpdateDate = await getItem('lastUpdateDate');

      const resourceType = lastUpdateDate !== '' ? 'update' : 'initial';
      const resourceFileName = `${resourceType}_${GLOBAL_STATE.dbResourceVersion}`;

      await resClient.getResourceList(resourceFileName);

      showAlert(
        'DB 업데이트',
        'DB 업데이트가 필요합니다' +
          `\n` +
          '다운로드 용량:' +
          formatBytes(resClient.resSize) +
          `\n` +
          '(wifi 사용권장)',
        [
          {
            text: '취소',
            onPress: () => {
              exitApp();
              return true;
            },
            style: {},
          },
          {
            text: '확인',
            onPress: () => {
              runUpdate();
            },
            style: {},
          },
        ],
        { modalType: 'exit', onRequestClose: handleClose },
      );
    };
    getResourceInfo();

    return () => {
      backHandler.remove();
    };
  }, [runUpdate, showAlert]);

  return (
    <Layout.initscreen>
      <View style={styles.initViewWrapper}>
        <View style={styles.logoViewWrapper}>
          <Image
            style={styles.logo}
            source={require('@assets/images/logo_default.png')}
          />
        </View>
        <View style={styles.infoViewWrapper}>
          <Text style={styles.infoText}>
            {state.status + ' ' + formatProgress(state.progress)}
          </Text>
          <Progress.Bar
            width={200}
            height={10}
            indeterminate={state.progress > 0 ? false : true}
            progress={state.progress}
            color="#7472EB"
            unfilledColor="#fff"
            borderWidth={0}
            borderColor="#cacaca"
            useNativeDriver={true}
          />
        </View>
      </View>
    </Layout.initscreen>
  );
};

const styles = StyleSheet.create({
  infoText: {
    color: '#fff',
    fontFamily: os.font(500, 500),
    fontSize: font(20),
    marginBottom: 16,
  },
  infoViewWrapper: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  initViewWrapper: { flex: 1 },
  logo: { height: 150, resizeMode: 'contain', width: 150 },
  logoViewWrapper: { alignItems: 'center', flex: 1, justifyContent: 'center' },
});

export default UpdateDB;
