import Config from "react-native-config";
import RNFS from 'react-native-fs';
import { Buffer } from "@craftzdog/react-native-buffer";
import 'react-native-url-polyfill/auto'
import 'react-native-get-random-values'
import { GetObjectCommand, ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { updateDBConfig } from "../db/config";

type TRangeAndLength = {
  start: number,
  end: number,
  length: number
}

export class DBResClient {
  private static instance: DBResClient
  private readonly client: S3Client
  private tenMB = 1024 * 1024 * 10
  private contents: any = null;
  public resSize: number = 0;
  public resCount: number = 0;

  constructor() {
    this.client = new S3Client({
      endpoint: Config.CLOUD_FLARE_RESOURCE_DOWNLOAD_URL,
      region: "auto",
      credentials: {
        accessKeyId: Config.CLOUD_FLARE_ACCESS_KEY_ID as string,
        secretAccessKey: Config.CLOUD_FLARE_SECRET_ACCESS_KEY as string
      }
    })
    console.log("create DBResClient")
  }

  public static getInstance = () => {
    if (!DBResClient.instance) {
      DBResClient.instance = new DBResClient();
    }
    return DBResClient.instance;
  }

  private getObjectRange = ({ key, start, end }: { key: string, start: number, end: number }) => {
    const command = new GetObjectCommand({
      Bucket: Config.CLOUD_FLARE_RESOURCE_BUCKET,
      Key: key,
      Range: `bytes=${start}-${end}`
    })

    return this.client.send(command)
  }

  private getRangeAndLength = (contentRange: string): TRangeAndLength => {
    const [range, length] = contentRange.split('/')
    const [start, end] = range.split('-')

    return {
      start: Number(start),
      end: Number(end),
      length: Number(length)
    }
  }

  private isComplete = ({ end, length }: TRangeAndLength) => end === length - 1;

  public async getResourceChunk(cb: () => void | undefined) {
    if (this.contents == null) {
      await this.getResourceList();
    }

    if (this.contents?.length == 0) {
      return false
    }

    if (!await RNFS.exists(RNFS.DocumentDirectoryPath + '/res')) {
      await RNFS.mkdir(RNFS.DocumentDirectoryPath + '/res')
    }

    let rangeAndLength: TRangeAndLength = { start: -1, end: -1, length: -1 }

    while (!this.isComplete(rangeAndLength)) {
      const { end } = rangeAndLength;
      const nextRange = { start: end + 1, end: end + this.tenMB }

      const { ContentRange, Body } = await this.getObjectRange({
        key: this.contents[0].Key as string,
        ...nextRange
      })

      const res = await Body?.transformToByteArray()

      if (!res) {
        return
      }

      const val = Buffer.from(res).toString('base64')
      await RNFS.appendFile(updateDBConfig.path as string, val, 'base64')

      cb();
      rangeAndLength = this.getRangeAndLength(ContentRange as string)
    }
  }

  public async getResourceList(mode: string = 'initial') {
    this.resSize = 0;
    const command = new ListObjectsV2Command({
      Bucket: Config.CLOUD_FLARE_RESOURCE_BUCKET,
    })

    this.contents = await this.client.send(command)
      .then((val) => val.Contents?.filter((value) => value.Key == mode + '.realm'))

    for (const content of this.contents) {
      this.resSize += content.Size || 0
    }
    this.resCount = parseInt((this.resSize / this.tenMB).toFixed()) + 1
  }

  public async clearRes() {
    if (await RNFS.exists(RNFS.DocumentDirectoryPath + '/res')) {
      await RNFS.unlink(RNFS.DocumentDirectoryPath + '/res')
    }
  }
}