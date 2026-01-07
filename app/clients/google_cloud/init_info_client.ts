import axios from "axios";
import { IClient } from "../client.interface";
import { GoogleAuthInstance } from "./auth";

type TInitInfoResponse = { playStoreVersion: string; appStoreVersion: string; resourceDate: string };

export class InitInfoClient
  extends GoogleAuthInstance
  implements IClient<TInitInfoResponse>
{
  private readonly serviceUrl: string;

  constructor() {
    super();
    this.serviceUrl = process.env.GOOGLE_CLOUD_INIT_INFO_URL as string;
  }

  public async request() {
    const result = await axios.get<TInitInfoResponse>(this.serviceUrl, {
      headers: { Authorization: `Bearer ${this.token}` },
    });

    return result.data;
  }
}

export function getGoogleCloudAPIClient() {}
