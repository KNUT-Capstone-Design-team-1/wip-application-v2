import dotenv from 'dotenv';
import _ from 'lodash';
import config from './config.json';
import data from './data.json';
import { GoogleCloud, CloudFlare } from '../../src/services/apis';

dotenv.config({ path: '.env.local' });

export async function callAPI() {
  const { apiList } = config;

  const results: Record<string, any> = {};

  try {
    if (apiList.includes('get-image-search-v2')) {
      results['get-image-search-v2'] =
        await GoogleCloud.PillImageFeatureExtractionAPI.requestPillImageFeatureExtraction(
          data.pillImageFeatureExtraction.v2base64,
        );
    }

    if (apiList.includes('get-drug-detail')) {
      results['get-drug-detail'] =
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

    if (apiList.includes('get-nearby-pharmacies')) {
      const param = _.pickBy(
        data.nearbyPharmacy,
        (value) => !_.isNil(value) && value !== '',
      );

      results['get-nearby-pharmacies'] =
        await CloudFlare.NearbyPharmacyAPI.requestGetNearbyPharmacies(param);
    }

    if (apiList.includes('mark-image')) {
      const { page, limit, title } = data.markImage;

      results['mark-image'] =
        await GoogleCloud.MarkImageAPI.requestGetMarkImage(page, limit, title);
    }

    if (apiList.includes('database-version')) {
      results['database-version'] =
        await GoogleCloud.DatabaseVersionAPI.requestDatabaseVersion();
    }

    if (apiList.includes('pill-data-table-schema')) {
      results['pill-data-table-schema'] =
        await GoogleCloud.PillDataTableSchemaAPI.requestTableSchema(
          'pill_data',
        );
    }

    if (apiList.includes('pill-data-resource')) {
      results['pill-data-resource'] =
        await GoogleCloud.PillDataResourceAPI.requestResourceData(
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
  } catch (e) {
    console.log('[CALL-API] Error occurred. %s', (e as Error).stack || e);
    throw e;
  } finally {
    return results;
  }
}
