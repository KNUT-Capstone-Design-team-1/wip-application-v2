import { useCallback } from 'react';
import { Linking } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useToast } from '@hooks/use_toast';
import { useExternalUrlStore } from '@store/external_url_store';
import { EXTERNAL_LINK_OPEN_DELAY_MS } from '../constants/pill_detail';
import type { SafetyExternalUrlKey } from '../types/pill_detail_component_type';

// 성분 복사·외부 정보 열기 명령.
export const useSafetyExternalLinkActions = (
  urlKey: SafetyExternalUrlKey,
  materialEngName?: string,
) => {
  const { showToast } = useToast();
  const handlePress = useCallback(async () => {
    const url = useExternalUrlStore.getState()[urlKey];

    if (materialEngName) {
      await Clipboard.setStringAsync(materialEngName);
      showToast({
        message:
          '검색 지원을 위해 영문 성분명 (' +
          materialEngName +
          ')이 복사되었습니다.',
      });
    }

    setTimeout(() => {
      Linking.openURL(url);
    }, EXTERNAL_LINK_OPEN_DELAY_MS);
  }, [urlKey, materialEngName, showToast]);

  return { handlePress };
};
