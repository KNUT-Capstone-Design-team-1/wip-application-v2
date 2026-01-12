import dotenv from 'dotenv';
import _ from 'lodash';
import config from './config.json';
import data from './data.json';
import {
  PillImageFeatureExtractionAPI,
  PillDetailAPI,
  MarkImageAPI,
  DatabaseVersionAPI,
  PillDataTableSchemaAPI,
  PillDataResourceAPI,
} from '../../app/apis/google_cloud';
import { NearbyPharmacyAPI, NoticeAPI } from '../../app/apis/cloud_flare';

dotenv.config({ path: '.env.local' });

export async function callAPI() {
  const { apiList } = config;

  const results: Record<string, any> = {};

  try {
    if (apiList.includes('get-image-search-v2')) {
      results['get-image-search-v2'] =
        await PillImageFeatureExtractionAPI.requestPillImageFeatureExtraction(
          data.pillImageFeatureExtraction.v2base64,
        );
    }

    if (apiList.includes('get-drug-detail')) {
      results['get-drug-detail'] =
        await PillDetailAPI.requestGetPillDetail('195500005');
    }

    if (apiList.includes('get-notices')) {
      results['get-notices'] = await NoticeAPI.requestReadNotices();
    }

    if (apiList.includes('post-notices')) {
      results['post-notices'] = await NoticeAPI.requestCreateNotice(
        data.noticeCreate,
      );
    }

    if (apiList.includes('put-notices-idx')) {
      results['put-notices-idx'] = await NoticeAPI.requestUpdateNotice(
        data.noticeUpdate.idx,
        data.noticeUpdate.contents,
      );
    }

    if (apiList.includes('delete-notices-idx')) {
      results['delete-notices-idx'] = await NoticeAPI.requestDeleteNotice(
        data.noticeDelete.idx,
      );
    }

    if (apiList.includes('get-nearby-pharmacies')) {
      const param = _.pickBy(
        data.nearbyPharmacy,
        (value) => !_.isNil(value) && value !== '',
      );

      results['get-nearby-pharmacies'] =
        await NearbyPharmacyAPI.requestGetNearbyPharmacies(param);
    }

    if (apiList.includes('mark-image')) {
      const { page, limit, title } = data.markImage;

      results['mark-image'] = await MarkImageAPI.requestGetMarkImage(
        page,
        limit,
        title,
      );
    }

    if (apiList.includes('database-version')) {
      results['database-version'] =
        await DatabaseVersionAPI.requestDatabaseVersion();
    }

    if (apiList.includes('pill-data-table-schema')) {
      results['pill-data-table-schema'] =
        await PillDataTableSchemaAPI.requestPillDataTableSchema();
    }

    if (apiList.includes('pill-data-resource')) {
      results['pill-data-resource'] =
        await PillDataResourceAPI.requestPillDataResource(
          data.pillDataResource.page,
        );
    }
  } catch (e) {
    console.log('[CALL-API] Error occurred. %s', (e as Error).stack || e);
    throw e;
  } finally {
    return results;
  }
}
