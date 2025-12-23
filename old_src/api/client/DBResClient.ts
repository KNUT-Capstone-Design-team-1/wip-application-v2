import RNFS from 'react-native-fs';
import { updateDBConfig } from '@api/db/config';
import { GLOBAL_STATE } from '@/global_state';
import { signRequest } from '@/utils/sigv4';
import { XMLParser } from 'fast-xml-parser';

type ResourceDownloadResult = {
  success: boolean;
  error?: string;
};

export class DBResClient {
  private static instance: DBResClient;
  private tenMB = 1024 * 1024 * 10;
  private contents: any = null;
  public resSize: number = 0;
  public resCount: number = 0;

  constructor() {
    console.log('create DBResClient');
  }

  public static getInstance = () => {
    if (!DBResClient.instance) {
      DBResClient.instance = new DBResClient();
    }
    return DBResClient.instance;
  };

  public async getResource(
    onProgress: (progress: number) => void,
  ): Promise<ResourceDownloadResult> {
    if (this.contents == null) {
      await this.getResourceList();
    }

    if (this.contents?.length === 0) {
      return {
        success: false,
        error: '알약 정보 업데이트 데이터가 없습니다.',
      };
    }

    const resDir = `${RNFS.DocumentDirectoryPath}/res`;
    if (!(await RNFS.exists(resDir))) {
      await RNFS.mkdir(resDir);
    }

    const url = `${process.env.EXPO_PUBLIC_CLOUD_FLARE_RESOURCE_DOWNLOAD_URL}/${process.env.EXPO_PUBLIC_CLOUD_FLARE_RESOURCE_BUCKET}/${this.contents[0].Key}`;
    const { headers } = signRequest('GET', url, {
      accessKeyId: process.env.EXPO_PUBLIC_CLOUD_FLARE_ACCESS_KEY_ID as string,
      secretAccessKey: process.env
        .EXPO_PUBLIC_CLOUD_FLARE_SECRET_ACCESS_KEY as string,
    });

    const task = RNFS.downloadFile({
      fromUrl: url,
      toFile: updateDBConfig.path as string,
      headers,
      progress: (e) => {
        onProgress(e.bytesWritten / e.contentLength);
      },
      progressDivider: 5,
    });

    const res = await task.promise.catch((e) => {
      console.log(e);
      throw e;
    });

    if (res.statusCode !== 200 && res.statusCode !== 206) {
      return { success: false, error: '알약 데이터 다운로드에 실패했습니다.' };
    }

    return { success: true };
  }

  public async getResourceList(
    mode: string = `initial_${GLOBAL_STATE.dbResourceVersion}`,
  ) {
    this.resSize = 0;
    console.log('fetching resource list');
    const url = `${process.env.EXPO_PUBLIC_CLOUD_FLARE_RESOURCE_DOWNLOAD_URL}/${process.env.EXPO_PUBLIC_CLOUD_FLARE_RESOURCE_BUCKET}?list-type=2`;
    const { headers } = signRequest('GET', url, {
      accessKeyId: process.env.EXPO_PUBLIC_CLOUD_FLARE_ACCESS_KEY_ID as string,
      secretAccessKey: process.env
        .EXPO_PUBLIC_CLOUD_FLARE_SECRET_ACCESS_KEY as string,
    });
    const res = await fetch(url, { headers });
    if (!res.ok) {
      throw new Error(`List failed: ${res.status}`);
    }
    const xml = await res.text();
    const data = new XMLParser({ ignoreAttributes: false }).parse(xml);
    this.contents = data.ListBucketResult.Contents.filter(
      (value: any) => value.Key === mode + '.realm',
    );

    for (const content of this.contents) {
      this.resSize += content.Size || 0;
    }
    this.resCount = parseInt((this.resSize / this.tenMB).toFixed()) + 1;
  }

  public async clearRes() {
    if (await RNFS.exists(RNFS.DocumentDirectoryPath + '/res')) {
      await RNFS.unlink(RNFS.DocumentDirectoryPath + '/res');
    }
  }
}
