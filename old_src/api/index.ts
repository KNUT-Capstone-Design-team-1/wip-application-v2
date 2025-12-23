import axios, { AxiosError } from 'axios';
import { getToken } from '@api/client/auth';

const axiosInstance = axios.create({
  baseURL: '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    apiversion: 2,
  },
});

// 에러 처리 (추후 명칭 수정하기)
const onError = (error: AxiosError) => {
  if (error.response) {
    const { status, data } = error.response;

    switch (status) {
      case 400:
        console.error('잘못된 요청입니다', data);
        break;
      case 401:
        console.error('인증되지 않은 요청입니다', data);
        break;
      case 403:
        console.error('인증되지 않은 요청입니다', data);
        break;
      case 404:
        console.error('잘못된 요청입니다', data);
        break;
      case 500:
        console.error('서버 오류입니다', data);
        break;
      default:
        console.error('알 수 없는 오류입니다', data);
        break;
    }
  } else if (error.request) {
    console.error('서버로 부터 응답이 없습니다.');
  } else {
    console.error('요청을 보내는 중 오류가 발생했습니다.', error.message);
  }

  return Promise.reject(error);
};

// TODO : 7월 말 회의 후 인터셉터에 있어야 하는 부분 추가하기
// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    // 토큰 동적 갱신
    const token = getToken();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => onError(error),
);

// 응답 인터셉터
axiosInstance.interceptors.response.use();

export default axiosInstance;
