import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

import { env } from "@/config/env";

import type { AuthOtpTicket, VerifyOtpPurpose } from "../types/auth.types";

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_REDIRECT_PATH = "auth/google";
const MAX_CALLBACK_PARAM_LENGTH = 2048;

type CallbackParamValue = string | string[] | undefined | null;

export class GoogleAuthError extends Error {
  code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = "GoogleAuthError";
    this.code = code;
  }
}

const getString = (value: unknown, fallback = "") => {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
};

const sanitizeParam = (value: CallbackParamValue, fallback = "") => {
  const rawValue = Array.isArray(value) ? value[0] : value;

  if (typeof rawValue !== "string") return fallback;

  return rawValue
    .trim()
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .slice(0, MAX_CALLBACK_PARAM_LENGTH);
};

const normalizeApiBaseUrl = () => {
  const rawBaseUrl = getString(env.apiBaseUrl);

  if (!rawBaseUrl) {
    throw new GoogleAuthError(
      "Base URL API belum dikonfigurasi di env.",
      "MISSING_API_BASE_URL",
    );
  }

  return rawBaseUrl.replace(/\/+$/g, "");
};

export const createMobileRedirectUri = () => {
  return Linking.createURL(GOOGLE_REDIRECT_PATH);
};

const createBackendGoogleAuthUrl = (purpose: VerifyOtpPurpose) => {
  const baseUrl = normalizeApiBaseUrl();
  const mobileRedirectUri = createMobileRedirectUri();

  const params = new URLSearchParams();
  params.set("purpose", purpose);
  params.set("platform", "mobile");

  /**
   * Beberapa alias dikirim supaya backend bisa mengambil salah satu tanpa
   * memecah kompatibilitas endpoint lama.
   */
  params.set("mobileRedirectUri", mobileRedirectUri);
  params.set("redirectUri", mobileRedirectUri);
  params.set("callbackUrl", mobileRedirectUri);
  params.set("returnTo", mobileRedirectUri);

  return `${baseUrl}/auth/google?${params.toString()}`;
};

const appendSearchParams = (target: Record<string, string>, rawParams = "") => {
  if (!rawParams) return;

  const params = new URLSearchParams(rawParams.replace(/^[?#]/, ""));

  params.forEach((value, key) => {
    target[key] = sanitizeParam(value);
  });
};

const parseCallbackParams = (callbackUrl: string) => {
  const params: Record<string, string> = {};

  try {
    const parsedUrl = new URL(callbackUrl);

    parsedUrl.searchParams.forEach((value, key) => {
      params[key] = sanitizeParam(value);
    });

    appendSearchParams(params, parsedUrl.hash);

    return params;
  } catch {
    const queryString = callbackUrl.split("?")[1]?.split("#")[0] || "";
    const hashString = callbackUrl.split("#")[1] || "";

    appendSearchParams(params, queryString);
    appendSearchParams(params, hashString);

    return params;
  }
};

const normalizePurpose = (
  value: unknown,
  fallbackPurpose: VerifyOtpPurpose,
): VerifyOtpPurpose => {
  return getString(value).toLowerCase() === "register"
    ? "register"
    : fallbackPurpose;
};

const getFirstParam = (
  params: Record<string, string>,
  keys: string[],
  fallback = "",
) => {
  for (const key of keys) {
    const value = getString(params[key]);
    if (value) return value;
  }

  return fallback;
};

const normalizeCallbackResult = (
  callbackUrl: string,
  fallbackPurpose: VerifyOtpPurpose,
): AuthOtpTicket => {
  const callbackParams = parseCallbackParams(callbackUrl);

  const status = getString(callbackParams.status).toLowerCase();
  const errorCode = getFirstParam(callbackParams, ["error", "code"]);
  const errorMessage = getFirstParam(callbackParams, [
    "message",
    "error_description",
    "errorMessage",
    "error_message",
  ]);

  if (errorCode || status === "error" || status === "failed") {
    throw new GoogleAuthError(
      errorMessage || "Login Google gagal.",
      errorCode || "GOOGLE_CALLBACK_ERROR",
    );
  }

  const email = getFirstParam(callbackParams, [
    "email",
    "user_email",
    "userEmail",
    "identifier",
  ]);

  const identifier = getFirstParam(
    callbackParams,
    ["identifier", "username", "email", "user_email", "userEmail"],
    email,
  );

  if (!identifier) {
    throw new GoogleAuthError(
      "Google berhasil, tetapi email atau identifier OTP tidak dikirim oleh server.",
      "MISSING_GOOGLE_OTP_IDENTIFIER",
    );
  }

  const otpToken = getFirstParam(callbackParams, [
    "otpToken",
    "otp_token",
    "otpTicket",
    "otp_ticket",
    "ticket",
    "challengeToken",
    "challenge_token",
  ]);

  const sessionId = getFirstParam(callbackParams, [
    "sessionId",
    "session_id",
    "challengeId",
    "challenge_id",
  ]);

  return {
    identifier,
    email: email || identifier,
    message: errorMessage || "OTP berhasil dikirim.",
    purpose: normalizePurpose(callbackParams.purpose, fallbackPurpose),
    otpToken: otpToken || undefined,
    sessionId: sessionId || undefined,
    callbackParams,
  };
};

const startGoogleAuthWithBackend = async (purpose: VerifyOtpPurpose) => {
  const authUrl = createBackendGoogleAuthUrl(purpose);
  const redirectUri = createMobileRedirectUri();

  const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

  if (result.type === "cancel" || result.type === "dismiss") {
    throw new GoogleAuthError("Login Google dibatalkan.", "SIGN_IN_CANCELLED");
  }

  if (result.type !== "success" || !result.url) {
    throw new GoogleAuthError("Login Google gagal.", "GOOGLE_AUTH_FAILED");
  }

  return normalizeCallbackResult(result.url, purpose);
};

export const configureGoogleAuth = async () => {
  normalizeApiBaseUrl();
};

export const signInWithGoogle = async () => {
  return startGoogleAuthWithBackend("login");
};

export const signUpWithGoogle = async () => {
  return startGoogleAuthWithBackend("register");
};

export const signOutFromGoogle = async () => {
  /**
   * Auth berbasis browser session. Logout utama cukup membersihkan session lokal
   * aplikasi. Browser session Google tidak dipaksa sign out agar UX tetap aman.
   */
};
