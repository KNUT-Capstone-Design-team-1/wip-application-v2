import axios from "axios";
import Config from "react-native-config";
import { getToken } from "./client/auth";

const postImageServer = (base64: string | undefined) => {
  return axios.post(
    Config.GOOGLE_CLOUD_DL_SERVER_URL as string,
    { base64 },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
        apiVersion: 2,
      },
      timeout: 1000 * 150
    }
  )
}

const getDrugDetail = (URL: string, ITEM_SEQ: string) => {
  return axios.get(
    URL,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
      params: {
        ITEM_SEQ: ITEM_SEQ,
      },
      timeout: 1000 * 100
    }
  )
}

export {
  postImageServer,
  getDrugDetail
}