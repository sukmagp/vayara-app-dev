import axios, {
  AxiosError,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from "axios";

import { env } from "@/config/env";
import { secureStorage } from "@/services/storage/secureStorage";
import { storageKeys } from "@/services/storage/storage.keys";
import type { ApiErrorPayload } from "./api.types";

export class ApiError extends Error {
  statusCode?: number;
  errors?: Record<string, string[] | string>;
  isNetworkError?: boolean;

  constructor(
    message: string,
    statusCode?: number,
    errors?: Record<string, string[] | string>,
    isNetworkError = false,
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
    this.isNetworkError = isNetworkError;
  }
}

const AUTH_PATHS_WITHOUT_USER_CONTEXT = new Set([
  "/auth/login",
  "/auth/register",
  "/auth/login/verify-otp",
  "/auth/fingerprint-login",
  "/auth/google-login",
  "/auth/logout",
]);

const normalizeUrlPath = (url?: string) => {
  if (!url) return "";

  const urlWithoutQuery = url.split("?")[0] || "";

  try {
    const parsedUrl = new URL(urlWithoutQuery, env.apiBaseUrl);

    return parsedUrl.pathname
      .replace(/\/+$/, "")
      .replace(/^\/api\/v\d+/i, "")
      .toLowerCase();
  } catch {
    return urlWithoutQuery
      .replace(/\/+$/, "")
      .replace(/^\/api\/v\d+/i, "")
      .toLowerCase();
  }
};

const shouldAttachUserContext = (config: InternalAxiosRequestConfig) => {
  const path = normalizeUrlPath(config.url);
  return !AUTH_PATHS_WITHOUT_USER_CONTEXT.has(path);
};

const normalizeUserId = (value: string | null) => {
  if (!value) return "";

  return value
    .trim()
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .slice(0, 120);
};

const isFormData = (value: unknown): value is FormData => {
  return typeof FormData !== "undefined" && value instanceof FormData;
};

const isUrlSearchParams = (value: unknown): value is URLSearchParams => {
  return (
    typeof URLSearchParams !== "undefined" && value instanceof URLSearchParams
  );
};

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    !isFormData(value) &&
    !isUrlSearchParams(value)
  );
};

const ensureHeaders = (config: InternalAxiosRequestConfig) => {
  const headers = AxiosHeaders.from(config.headers);
  config.headers = headers;
  return headers;
};

const attachHeader = (
  config: InternalAxiosRequestConfig,
  key: string,
  value: string,
) => {
  const headers = ensureHeaders(config);
  headers.set(key, value);
};

const parseJsonBody = (value: string): Record<string, unknown> | null => {
  try {
    const parsed = JSON.parse(value);
    return isPlainObject(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const attachUserIdToParams = (
  config: InternalAxiosRequestConfig,
  userId: string,
) => {
  if (!config.params) {
    config.params = { user_id: userId };
    return;
  }

  if (isUrlSearchParams(config.params)) {
    if (!config.params.has("user_id")) {
      config.params.set("user_id", userId);
    }

    return;
  }

  if (isPlainObject(config.params)) {
    config.params = {
      ...config.params,
      user_id: config.params.user_id || userId,
    };
  }
};

const attachUserIdToBody = (
  config: InternalAxiosRequestConfig,
  userId: string,
) => {
  const method = String(config.method || "get").toLowerCase();

  if (["get", "head", "options"].includes(method)) return;

  if (!config.data) {
    config.data = {
      user_id: userId,
    };
    return;
  }

  if (isFormData(config.data)) {
    if (!config.data.has?.("user_id")) {
      config.data.append("user_id", userId);
    }

    return;
  }

  if (isPlainObject(config.data)) {
    config.data = {
      ...config.data,
      user_id: config.data.user_id || userId,
    };

    return;
  }

  if (typeof config.data === "string") {
    const parsedBody = parseJsonBody(config.data);

    if (parsedBody) {
      config.data = JSON.stringify({
        ...parsedBody,
        user_id: parsedBody.user_id || userId,
      });
    }
  }
};

const getFirstValidationMessage = (
  errors?: Record<string, string[] | string>,
): string | null => {
  if (!errors) return null;

  const firstKey = Object.keys(errors)[0];
  if (!firstKey) return null;

  const firstValue = errors[firstKey];

  if (Array.isArray(firstValue)) {
    return firstValue[0] || null;
  }

  if (typeof firstValue === "string") {
    return firstValue;
  }

  return null;
};

const getSafeErrorMessage = (
  payload?: ApiErrorPayload,
  fallback = "Terjadi kesalahan. Silakan coba lagi.",
) => {
  const message = payload?.message;
  const error = payload?.error;
  const validationMessage = getFirstValidationMessage(payload?.errors);

  if (validationMessage) return validationMessage;
  if (typeof message === "string" && message.trim()) return message.trim();
  if (typeof error === "string" && error.trim()) return error.trim();

  return fallback;
};

const maskSensitiveJson = (value: unknown) => {
  if (!value) return value;

  try {
    const raw = typeof value === "string" ? JSON.parse(value) : value;

    if (!isPlainObject(raw)) return value;

    const cloned = { ...raw };

    const sensitiveKeys = [
      "password",
      "conf_password",
      "confirmPassword",
      "confirm_password",
      "otp",
      "token",
      "accessToken",
      "refreshToken",
      "idToken",
      "authorization",
    ];

    for (const key of sensitiveKeys) {
      if (key in cloned) cloned[key] = "[REDACTED]";
    }

    return cloned;
  } catch {
    return "[UNREADABLE_REQUEST_BODY]";
  }
};

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
    const userId = normalizeUserId(
      await secureStorage.getItem(storageKeys.userId),
    );

    if (userId && shouldAttachUserContext(config)) {
      attachHeader(config, "X-User-Id", userId);
      attachUserIdToParams(config, userId);
      attachUserIdToBody(config, userId);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorPayload>) => {
    const statusCode = error.response?.status;
    const responsePayload = error.response?.data;

    if (__DEV__) {
      console.log("API_ERROR_MESSAGE", error.message);
      console.log("API_ERROR_CODE", error.code);
      console.log("API_ERROR_STATUS", statusCode);
      console.log("API_ERROR_URL", error.config?.url);
      console.log("API_ERROR_BASE_URL", error.config?.baseURL);
      console.log(
        "API_ERROR_FULL_URL",
        `${error.config?.baseURL || ""}${error.config?.url || ""}`,
      );
      console.log("API_ERROR_METHOD", error.config?.method);
      console.log(
        "API_ERROR_REQUEST_DATA",
        JSON.stringify(maskSensitiveJson(error.config?.data), null, 2),
      );
      console.log(
        "API_ERROR_RESPONSE",
        JSON.stringify(responsePayload, null, 2),
      );
      console.log("API_ERROR_RAW_RESPONSE", error.request?._response);
    }

    if (error.code === "ECONNABORTED") {
      return Promise.reject(
        new ApiError("Request timeout. Server terlalu lama merespons.", 408),
      );
    }

    if (!error.response) {
      return Promise.reject(
        new ApiError(
          error.request?._response ||
            error.message ||
            "Tidak bisa terhubung ke server. Periksa koneksi atau endpoint API.",
          0,
          undefined,
          true,
        ),
      );
    }

    const fallbackMessage =
      statusCode === 401
        ? "Sesi tidak valid. Silakan login kembali."
        : statusCode === 403
          ? "Anda tidak memiliki akses untuk melakukan aksi ini."
          : statusCode && statusCode >= 500
            ? "Server sedang bermasalah. Silakan coba beberapa saat lagi."
            : "Terjadi kesalahan. Silakan coba lagi.";

    return Promise.reject(
      new ApiError(
        getSafeErrorMessage(responsePayload, fallbackMessage),
        statusCode,
        responsePayload?.errors,
      ),
    );
  },
);