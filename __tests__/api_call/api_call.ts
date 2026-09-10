import fs from 'fs';
import path from 'path';
import config from './config.json';
import data from './data.json';
import { GoogleCloud, CloudFlare } from '../../src/services/apis';

try {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex !== -1) {
        const key = trimmed.slice(0, eqIndex).trim();
        let value = trimmed.slice(eqIndex + 1).trim();
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
        if (!(key in process.env)) {
          process.env[key] = value;
        }
      }
    });
  }
} catch (e) {
  console.warn('[CALL-API] Failed to load .env.local:', e);
}

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
          50,
        );
    }

    if (apiList.includes('external-url')) {
      results['external-url'] =
        await GoogleCloud.ExternalURLAPI.requestExternalURL();
    }
  } catch (e) {
    console.log('[CALL-API] Error occurred.', (e as Error).stack || e);
    throw e;
  } finally {
    return results;
  }
}
