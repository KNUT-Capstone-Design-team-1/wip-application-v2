import axios from 'axios';
import { getToken } from '@api/client/auth';

const token = getToken();

const axiosInstance = axios.create({
  baseURL: '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    apiVersion: 2,
  },
});

// TODO : 7월 말 회의 후 인터셉터에 있어야 하는 부분 추가하기
// 요청 인터셉터
axiosInstance.interceptors.request.use();

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // 새로운 토큰 갱신
      const token = getToken();

      // 헤더 업데이트
      axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
      originalRequest.headers.Authorization = `Bearer ${token}`;
      return axiosInstance(originalRequest);
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
