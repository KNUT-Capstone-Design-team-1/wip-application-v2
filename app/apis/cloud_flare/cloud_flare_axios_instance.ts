import axios from 'axios';

/**
 * 클라우드 플레어 서버리스 API 호출 axios 클라이언트
 */
const CLOUD_FLARE_AXIOS_INSTANCE = axios.create({
  baseURL: process.env.CLOUD_FLARE_WORKERS_NEARBY_PHARMACIES_API_URL as string,
  headers: {
    Authorization: `Bearer ${process.env.CLOUD_FLARE_WORKERS_TOKEN as string}`,
  },
});

export default CLOUD_FLARE_AXIOS_INSTANCE;
