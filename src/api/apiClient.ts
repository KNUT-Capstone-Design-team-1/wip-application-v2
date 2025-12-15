import axiosInstance from '@api/index';
import { AxiosRequestConfig } from 'axios';

export const apiClient = {
  get: async <T>(
    url: string,
    params?: object,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const response = await axiosInstance.get<T>(url, {
      params,
      ...config,
    });

    return response.data;
  },

  post: async <T>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig,
  ): Promise<{ res: T; status: number; message: string }> => {
    const response = await axiosInstance.post<T>(url, data, config);

    return {
      res: response.data,
      status: response.status,
      message: (response.data as any).message ?? '',
    };
  },
};
