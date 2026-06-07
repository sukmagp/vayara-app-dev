import Constants from "expo-constants";

type AppEnv = {
  appName: string;
  appEnv: string;
  apiBaseUrl: string;
  apiTimeoutMs: number;
  googleWebClientId: string;
  googleIosClientId: string;
};

const extra = Constants.expoConfig?.extra ?? {};

const toStringValue = (value: unknown, fallback: string) => {
  if (typeof value !== "string") return fallback;

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
};

const toNumberValue = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const normalizeBaseUrl = (value: string) => {
  return value.trim().replace(/\/+$/, "");
};

export const env: AppEnv = {
  appName: toStringValue(
    process.env.EXPO_PUBLIC_APP_NAME ?? extra.appName,
    "Vayara",
  ),

  appEnv: toStringValue(
    process.env.EXPO_PUBLIC_APP_ENV ?? extra.appEnv,
    "development",
  ),

  apiBaseUrl: normalizeBaseUrl(
    toStringValue(
      process.env.EXPO_PUBLIC_API_BASE_URL ?? extra.apiBaseUrl,
      "https://backend-super-apps-travel-96zp.vercel.app/api/v1",
    ),
  ),

  apiTimeoutMs: toNumberValue(
    process.env.EXPO_PUBLIC_API_TIMEOUT_MS ?? extra.apiTimeoutMs,
    30000,
  ),

  googleWebClientId: toStringValue(
    process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? extra.googleWebClientId,
    "",
  ),

  googleIosClientId: toStringValue(
    process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? extra.googleIosClientId,
    "",
  ),
};