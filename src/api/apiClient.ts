import axiosInstance from '@api/index';
import { AxiosError, isAxiosError } from 'axios';
import { ToastAndroid } from 'react-native';

export interface IErrorResponse {
  error: true;
  message: string;
  status?: number;
}

const handleError = (error: unknown): IErrorResponse => {
  if (isAxiosError(error)) {
    const err = error as AxiosError<any>;
    return {
      error: true,
      message:
        err.response?.data?.message ?? '데이터 요청 중 오류가 발생했습니다.',
      status: err.response?.status,
    };
  }

  ToastAndroid.show(`앱 종료 후 다시 실행시켜주세요.`, ToastAndroid.SHORT);

  return {
    error: true,
    message: '예상치 못한 오류가 발생했습니다.',
  };
};

export const apiClient = {
  get: async <T>(url: string, params?: object): Promise<T | any> => {
    try {
      const response = await axiosInstance.get<T>(url, {
        params,
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  post: async <T>(
    url: string,
    data?: object,
  ): Promise<{ res: T; status: number; message: string }> => {
    const response = await axiosInstance.post<T>(url, data);

    return {
      res: response.data,
      status: response.status,
      message: (response.data as any).message ?? '',
    };
  },
};
