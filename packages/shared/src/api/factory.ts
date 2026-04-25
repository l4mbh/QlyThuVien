import axios, { AxiosInstance } from 'axios';

export interface ApiClientConfig {
  baseURL: string;
  getToken?: () => string | null;
  onUnauthorized?: () => void;
  onError?: (message: string) => void;
}

export const createSharedApiClient = (config: ApiClientConfig): AxiosInstance => {
  const instance = axios.create({
    baseURL: config.baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request Interceptor: Attach Token
  instance.interceptors.request.use(
    (req) => {
      const token = config.getToken?.();
      if (token) {
        req.headers.Authorization = `Bearer ${token}`;
      }
      return req;
    },
    (error) => Promise.reject(error)
  );

  // Response Interceptor: Always 200 Handling & Errors
  instance.interceptors.response.use(
    (response) => {
      const { data } = response;
      
      // Standardize "Always 200" response structure
      // Success is usually indicated by a code field or just successful HTTP status
      if (data && data.code && data.code !== 'SUCCESS' && data.code !== 200 && data.code !== 0) {
        const errorMsg = data.message || 'Unknown error occurred';
        
        // Handle specific error codes if needed
        if (data.code === 'UNAUTHORIZED' || data.code === 'TOKEN_EXPIRED') {
          config.onUnauthorized?.();
        }

        config.onError?.(errorMsg);
        return Promise.reject(data);
      }

      return response;
    },
    (error) => {
      // Handle Network errors or non-200 responses if they bypass Always 200
      const message = error.response?.data?.message || error.message || 'Network Error';
      
      if (error.response?.status === 401) {
        config.onUnauthorized?.();
      }

      config.onError?.(message);
      return Promise.reject(error);
    }
  );

  return instance;
};
