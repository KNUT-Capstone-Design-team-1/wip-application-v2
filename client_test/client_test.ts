import dotenv from 'dotenv';
import _ from 'lodash';
import config from './config.json';
import data from './data.json';
import {
  PillImageFeatureExtractionAPI,
  PillDetailAPI,
  MarkImageAPI,
} from '../../app/apis/google_cloud';
import { NearbyPharmacyAPI, NoticeAPI } from '../../app/apis/cloud_flare';

dotenv.config({ path: '.env.local' });

async function callAPI() {
  const {
    apiList,
    markImage: { page, limit, title },
  } = config;

  if (apiList.includes('get-image-search-v2')) {
    console.log(
      await PillImageFeatureExtractionAPI.requestPillImageFeatureExtraction(
        data.v2base64,
      ),
    );
  }

  if (apiList.includes('get-drug-detail')) {
    console.log(await PillDetailAPI.requestGetPillDetail('195500005'));
  }

  if (apiList.includes('get-notices')) {
    console.log(JSON.stringify(await NoticeAPI.requestReadNotices()));
  }

  if (apiList.includes('post-notices')) {
    const contents = {
      title: 'wip-client-test',
      contents: '클라이언트만 되면 끝',
      mustRead: true,
    };

    console.log(JSON.stringify(await NoticeAPI.requestCreateNotice(contents)));
  }

  if (apiList.includes('put-notices-idx')) {
    const idx = 3;
    const contents = {
      title: 'wip-update-test',
      contents: '업데이트 됨',
      mustRead: true,
    };

    console.log(
      JSON.stringify(await NoticeAPI.requestUpdateNotice(idx, contents)),
    );
  }

  if (apiList.includes('delete-notices-idx')) {
    const idx = 5;

    console.log(JSON.stringify(await NoticeAPI.requestDeleteNotice(idx)));
  }

  if (apiList.includes('get-nearby-pharmacies')) {
    const params = _.pickBy(
      config.nearbyPharmacy,
      (value) => !_.isNil(value) && value !== '',
    );

    console.log(
      JSON.stringify(
        await NearbyPharmacyAPI.requestGetNearbyPharmacies(params),
      ),
    );
  }

  if (apiList.includes('mark-image')) {
    console.log(
      JSON.stringify(
        await MarkImageAPI.requestGetMarkImage(page, limit, title),
      ),
    );
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const started = new Date();

  const maxExecuteSeconds = config.common.maxApiCallMinute * 1000 * 60; // min
  const interval = config.common.apiCallIntervalSecond * 1000; // sec

  let executeSeconds = 0;

  const { apiList } = config;

  if (!apiList.some((v) => !/^_/.test(v))) {
    console.log(
      '[CALL-API] No API list. check config.json. delete "_" at apiList element',
    );
    return;
  }

  while (executeSeconds <= maxExecuteSeconds) {
    try {
      await callAPI();
      console.log(
        '[MAIN] execute %s seconds...',
        Math.floor(executeSeconds / 1000),
      );
    } catch (e) {
      console.log('[MAIN] error. %s', (e as Error).stack);
    } finally {
      executeSeconds = new Date().getTime() - started.getTime();
      await delay(interval);
    }
  }
}

main();
