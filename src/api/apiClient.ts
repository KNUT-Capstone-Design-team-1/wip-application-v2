import axiosInstance from '@api/index.ts';

export const apiClient = {
  get: async <T>(url: string, params?: object): Promise<T> => {
    const response = await axiosInstance.get<T>(url, {
      params,
    });

    return response.data;
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
