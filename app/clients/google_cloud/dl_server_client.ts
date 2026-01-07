import axios from "axios";
import { IClient } from "../client.interface";
import { GoogleAuthInstance } from "./auth";

type TDLServerResponse = {
  success: boolean;
  data?: Array<{ ITEM_SEQ: string }>;
  message?: string;
};

export class DLServerClient
  extends GoogleAuthInstance
  implements IClient<TDLServerResponse>
{
  private readonly serviceUrl: string;

  constructor() {
    super();
    this.serviceUrl = process.env.GOOGLE_CLOUD_DL_SERVER_URL as string;
  }

  public async request(base64: string) {
    const result = await axios.post<TDLServerResponse>(
      this.serviceUrl,
      { base64 },
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return result.data;
  }
}
