import RNFS from 'react-native-fs';
import { Buffer } from '@craftzdog/react-native-buffer';
import {
  GetObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from '@aws-sdk/client-s3';
import { updateDBConfig } from '@api/db/config';
import pLimit from 'p-limit';
import { GLOBAL_STATE } from '@/global_state';

type TRangeAndLength = { start: number; end: number };

export class DBResClient {
  private static instance: DBResClient;
  private readonly client: S3Client;
  private tenMB = 1024 * 1024 * 10;
  private contents: any = null;
  public resSize: number = 0;
  public resCount: number = 0;

  constructor() {
    this.client = new S3Client({
      endpoint: process.env.EXPO_PUBLIC_CLOUD_FLARE_RESOURCE_DOWNLOAD_URL,
      region: 'auto',
      credentials: {
        accessKeyId: process.env
          .EXPO_PUBLIC_CLOUD_FLARE_ACCESS_KEY_ID as string,
        secretAccessKey: process.env
          .EXPO_PUBLIC_CLOUD_FLARE_SECRET_ACCESS_KEY as string,
      },
    });
    console.log('create DBResClient');
  }

  public static getInstance = () => {
    if (!DBResClient.instance) {
      DBResClient.instance = new DBResClient();
    }
    return DBResClient.instance;
  };

  private getObjectRange = ({
    key,
    start,
    end,
  }: {
    key: string;
    start: number;
    end: number;
  }) => {
    const command = new GetObjectCommand({
      Bucket: process.env.EXPO_PUBLIC_CLOUD_FLARE_RESOURCE_BUCKET,
      Key: key,
      Range: `bytes=${start}-${end}`,
    });

    return this.client.send(command);
  };

  private isComplete = ({ end }: TRangeAndLength) => end >= this.resSize - 1;

  public async getResourceChunk(cb: () => void | undefined) {
    if (this.contents == null) {
      await this.getResourceList();
    }

    if (this.contents?.length == 0) {
      return false;
    }

    const resDir = `${RNFS.DocumentDirectoryPath}/res`;
    if (!(await RNFS.exists(resDir))) {
      await RNFS.mkdir(resDir);
    }

    const ranges: TRangeAndLength[] = [];
    let rangeAndLength: TRangeAndLength = { start: -1, end: -1 };

    while (!this.isComplete(rangeAndLength)) {
      const { end } = rangeAndLength;
      ranges.push({ start: end + 1, end: end + this.tenMB });
      rangeAndLength = { start: end + 1, end: end + this.tenMB };
    }

    const limit = pLimit(2);
    const tasks: Promise<string>[] = ranges.map((range, index) =>
      limit(async () => {
        const { Body } = await this.getObjectRange({
          key: this.contents[0].Key as string,
          ...range,
        });

        const res = await Body?.transformToByteArray();

        if (!res) {
          throw new Error(`Failed to download file: ${JSON.stringify(range)}`);
        }

        const partPath = `${resDir}/chunk_${index}`;
        await RNFS.writeFile(
          partPath,
          Buffer.from(res).toString('base64'),
          'base64',
        );
        cb();
        return partPath;
      }),
    );

    const getFiles = await Promise.all(tasks);

    getFiles.sort((a, b) => {
      const aNum = parseInt(a.split('_')[1]);
      const bNum = parseInt(b.split('_')[1]);
      return aNum - bNum;
    });

    for (const filePath of getFiles) {
      const content = await RNFS.readFile(filePath, 'base64');
      await RNFS.appendFile(updateDBConfig.path as string, content, 'base64');
      await RNFS.unlink(filePath);
    }
  }

  public async getResourceList(
    mode: string = `initial_${GLOBAL_STATE.dbResourceVersion}`,
  ) {
    this.resSize = 0;
    const command = new ListObjectsV2Command({
      Bucket: process.env.EXPO_PUBLIC_CLOUD_FLARE_RESOURCE_BUCKET,
    });

    this.contents = await this.client
      .send(command)
      .then((val) =>
        val.Contents?.filter((value) => value.Key == mode + '.realm'),
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
