import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from "axios";
import { StatusCode, ErrorCode } from "@/types/api.enum";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

export const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
      // Handle Unauthorized error code (401001)
      if (data.code === ErrorCode.UNAUTHORIZED) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }

      // Handle Internal Server Error code (500001)
      let message = data.error?.msg || "Something went wrong";
      if (data.code === ErrorCode.INTERNAL_SERVER_ERROR) {
        message = "Server error, please try again later";
      }

      // If code is not 0, treat it as an error
      return Promise.reject({
        response,
        message,
        code: data.code,
      });
    }
    return response;
  },
  (error: AxiosError) => {

    if (error.response) {
      const data = error.response.data as any;

      // Even if BE aims for 200, some infra (CORS, Nginx) might return 401/403
      if (error.response.status === StatusCode.UNAUTHORIZED) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }

      // Handle Internal Server Error
      let message = data?.error?.msg || error.message;
      if (error.response.status === StatusCode.INTERNAL_SERVER_ERROR) {
        message = "Server error, please try again later";
      }

      error.message = message;
    }
    return Promise.reject(error);
  }
);
