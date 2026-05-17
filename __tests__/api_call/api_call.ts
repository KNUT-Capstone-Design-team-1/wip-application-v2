import dotenv from 'dotenv';
import config from './config.json';
import data from './data.json';
import { GoogleCloud, CloudFlare } from '../../src/services/apis';

dotenv.config({ path: '.env.local' });

export async function callAPI() {
  const { apiList } = config;

  const results: Record<string, any> = {};

  try {
    if (apiList.includes('get-pill-image-feature-extraction')) {
      results['get-pill-image-feature-extraction'] =
        await GoogleCloud.PillImageFeatureExtractionAPI.requestPillImageFeatureExtraction(
          data.pillImageFeatureExtraction,
        );
    }

    if (apiList.includes('get-pill-detail')) {
      results['get-pill-detail'] =
        await GoogleCloud.PillDetailAPI.requestGetPillDetail(
          data.pillDetail.ITEM_SEQ,
        );
    }

    if (apiList.includes('get-notices')) {
      results['get-notices'] = await CloudFlare.NoticeAPI.requestReadNotices();
    }

    if (apiList.includes('post-notices')) {
      results['post-notices'] = await CloudFlare.NoticeAPI.requestCreateNotice(
        data.noticeCreate,
      );
    }

    if (apiList.includes('put-notices-idx')) {
      results['put-notices-idx'] =
        await CloudFlare.NoticeAPI.requestUpdateNotice(
          data.noticeUpdate.idx,
          data.noticeUpdate.contents,
        );
    }

    if (apiList.includes('delete-notices-idx')) {
      results['delete-notices-idx'] =
        await CloudFlare.NoticeAPI.requestDeleteNotice(data.noticeDelete.idx);
    }

    if (apiList.includes('database-version')) {
      results['database-version'] =
        await GoogleCloud.DatabaseVersionAPI.requestDatabaseVersion();
    }

    if (apiList.includes('table-schema')) {
      results['table-schema'] =
        await GoogleCloud.TableSchemaAPI.requestTableSchema('pill_data');
    }

    if (apiList.includes('resource-data')) {
      results['resource-data'] =
        await GoogleCloud.ResourceDataAPI.requestResourceData(
          'pill_data',
          data.pillDataResource.page,
        );
    }

    if (apiList.includes('log')) {
      results['log'] = await GoogleCloud.LogAPI.requestWriteLog(
        data.log.logLevel as 'info' | 'warn' | 'error',
        data.log.logContents,
      );
    }

    if (apiList.includes('unified-search')) {
      results['unified-search'] =
        await CloudFlare.UnifiedSearchAPI.requestUnifiedSearch(
          data.unifiedSearch.keywords,
        );
    }

    if (apiList.includes('external-url')) {
      results['external-url'] =
        await GoogleCloud.ExternalURLAPI.requestExternalURL();
    }
  } catch (e) {
    console.log('[CALL-API] Error occurred. %s', (e as Error).stack || e);
    throw e;
  } finally {
    return results;
  }
}
