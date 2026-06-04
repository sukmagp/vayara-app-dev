import Constants from "expo-constants";

type AppEnv = {
  appName: string;
  appEnv: string;
  apiBaseUrl: string;
  apiTimeoutMs: number;
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

export const env: AppEnv = {
  appName: toStringValue(extra.appName, "Vayara"),
  appEnv: toStringValue(extra.appEnv, "development"),
  apiBaseUrl: toStringValue(extra.apiBaseUrl, "http://localhost:3001/api"),
  apiTimeoutMs: toNumberValue(extra.apiTimeoutMs, 30000),
};