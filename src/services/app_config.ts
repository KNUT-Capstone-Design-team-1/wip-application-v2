import { requestExternalURL } from '@services/apis/google_cloud/wip_external_url';
import { useExternalUrlStore } from '@store/external_url_store';
import { logger } from '@utils/index';

/**
 * 외부 API로부터 설정 정보를 가져와서 스토어에 업데이트
 */
export const loadExternalConfig = async () => {
  try {
    const externalUrls = await requestExternalURL();

    useExternalUrlStore.getState().setUrls(externalUrls);

    console.log(`Complete load external URLs: ${JSON.stringify(externalUrls)}`);

    return true;
  } catch (e) {
    logger.error(
      `Failed to fetch external URLs. Using defaults. error: ${e.stack || e}`,
    );

    return false;
  }
};
