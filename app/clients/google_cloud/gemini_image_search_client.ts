import axios from "axios";
import { IClient } from "../client.interface";
import { GoogleAuthInstance } from "./auth";

type TGeminiImageSearchResponse = {
  success: boolean;
  data?: { PRINT: string[], SHAPE: string[], COLOR: string[] };
  message?: string;
};

export class GeminiImageSearchClient
  extends GoogleAuthInstance
  implements IClient<TGeminiImageSearchResponse> {
  private readonly serviceUrl: string;

  constructor() {
    super();
    this.serviceUrl = process.env.GOOGLE_CLOUD_DL_SERVER_URL as string;
  }

  public async request(base64: string) {
    const result = await axios.post<TGeminiImageSearchResponse>(
      this.serviceUrl,
      { base64 },
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
          apiversion: 2
        },
      });

    return result.data;
  }
}