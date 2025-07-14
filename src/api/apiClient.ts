import axiosInstance from '@api/index.ts';
import { getToken } from '@api/client/auth.ts';

export const apiClient = {
  get: async <T>(url: string, params?: object): Promise<T> => {
    const response = await axiosInstance.get<T>(url, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      params,
      timeout: 1000 * 100,
    });

    return response.data;
  },

  post: async <T>(url: string, data?: object): Promise<{ res: T; status: number, message: string }> => {
    const response = await axiosInstance.post<T>(url, data, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
        apiVersion: 2,
      },
      timeout: 1000 * 150,
    });

    return {
      res: response.data,
      status: response.status,
      message: (response.data as any).message ?? '',
    };
  },
};
