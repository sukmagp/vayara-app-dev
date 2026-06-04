import { env } from "@/config/env";
import { secureStorage } from "@/services/storage/secureStorage";
import { storageKeys } from "@/services/storage/storage.keys";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

type ApiErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

export class ApiError extends Error {
  statusCode?: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    statusCode?: number,
    errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeoutMs,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await secureStorage.getItem(storageKeys.accessToken);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const statusCode = error.response?.status;
    const apiMessage = error.response?.data?.message;
    const apiErrors = error.response?.data?.errors;

    if (error.code === "ECONNABORTED") {
      return Promise.reject(
        new ApiError("Request timeout. Periksa koneksi atau server mock API.", 408),
      );
    }

    if (!error.response) {
      return Promise.reject(
        new ApiError(
          `Tidak bisa terhubung ke API. Pastikan Mockoon aktif dan base URL benar: ${env.apiBaseUrl}`,
        ),
      );
    }

    const safeMessage =
      apiMessage ||
      (statusCode === 401
        ? "Sesi tidak valid. Silakan login kembali."
        : "Terjadi kesalahan. Silakan coba lagi.");

    return Promise.reject(new ApiError(safeMessage, statusCode, apiErrors));
  },
);