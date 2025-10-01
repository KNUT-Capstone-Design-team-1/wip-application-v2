import axios from 'axios';
import { getToken } from '@api/client/auth';

const axiosInstance = axios.create({
  baseURL: '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    apiversion: 2,
  },
});

// TODO : 7월 말 회의 후 인터셉터에 있어야 하는 부분 추가하기
// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    // 토큰 동적 갱신
    const token = getToken();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터
axiosInstance.interceptors.response.use();

export default axiosInstance;
