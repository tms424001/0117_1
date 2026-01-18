/**
 * 请求封装
 */

import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import type { ApiError } from '@/types';

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
request.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError<ApiError>) => {
    const apiError: ApiError = error.response?.data || {
      code: 'NETWORK_ERROR',
      message: error.message || '网络错误',
    };
    return Promise.reject(apiError);
  }
);

export { request };

// 通用请求方法
export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return request.get(url, config);
}

export async function post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  return request.post(url, data, config);
}

export async function put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  return request.put(url, data, config);
}

export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return request.delete(url, config);
}
