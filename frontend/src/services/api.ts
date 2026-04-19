import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from "axios";
import { StatusCode } from "@/types/api.enum";

const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

export const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    // Add auth token logic here if needed in the future
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response;
    // Check for custom success code (0)
    if (data && typeof data.code !== "undefined" && data.code !== 0) {
      // If code is not 0, treat it as an error
      return Promise.reject({
        response,
        message: data.error?.msg || "Something went wrong",
      });
    }
    return response;
  },
  (error: AxiosError) => {
    // Handle standard HTTP errors if they occur (though BE aims for 200)
    if (error.response) {
      const data = error.response.data as any;
      if (error.response.status === StatusCode.UNAUTHORIZED) {
        // Handle unauthorized logic
      }
      error.message = data?.error?.msg || error.message;
    }
    return Promise.reject(error);
  }
);
