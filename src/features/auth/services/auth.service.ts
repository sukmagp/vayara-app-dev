import type { AxiosError } from "axios";

import type { ApiResponse } from "@/services/api/api.types";
import { apiClient } from "@/services/api/apiClient";

import type {
  AuthOtpTicket,
  AuthResponse,
  AuthUser,
  GoogleLoginPayload,
  LoginPayload,
  RegisterPayload,
  VerifyOtpPayload,
  VerifyOtpPurpose,
  VerifyOtpResult,
} from "../types/auth.types";

type AnyRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is AnyRecord => {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
};

const getString = (value: unknown, fallback = "") => {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
};

const getNumberString = (value: unknown, fallback = "") => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return getString(value, fallback);
};

const unwrapApiResponse = <T>(payload: ApiResponse<T> | T): T => {
  if (isRecord(payload) && "data" in payload) {
    return payload.data as T;
  }

  return payload as T;
};

const getResponseData = (payload: unknown) => {
  if (isRecord(payload) && "data" in payload) {
    return payload.data;
  }

  return payload;
};

const getResponseMessage = (payload: unknown, data: unknown, fallback = "") => {
  return (
    (isRecord(payload) ? getString(payload.message) : "") ||
    (isRecord(data) ? getString(data.message) : "") ||
    fallback
  );
};

const getHttpStatus = (error: unknown) => {
  const maybeAxiosError = error as AxiosError | undefined;
  return Number(maybeAxiosError?.response?.status || 0);
};

const shouldFallbackVerifyEndpoint = (error: unknown) => {
  return [404, 405, 501].includes(getHttpStatus(error));
};

const isMaskedIdentifier = (value: string) => {
  return value.includes("***") || value.includes("*") || value.includes("•");
};

const getRecordValue = (record: unknown, keys: string[], fallback = "") => {
  if (!isRecord(record)) return fallback;

  for (const key of keys) {
    const value = getString(record[key]) || getNumberString(record[key]);
    if (value) return value;
  }

  return fallback;
};

const normalizeUser = (raw: unknown, fallbackUserId = ""): AuthUser => {
  if (!isRecord(raw)) {
    return {
      id: fallbackUserId,
      fullName: "User",
      email: "",
      username: null,
      avatarUrl: null,
    };
  }

  const id = getRecordValue(raw, ["id", "user_id", "userId"], fallbackUserId);

  const firstName = getRecordValue(raw, ["first_name", "firstName"]);
  const lastName = getRecordValue(raw, ["last_name", "lastName"]);

  const fullName = getRecordValue(raw, [
    "full_name",
    "fullName",
    "display_name",
    "displayName",
    "name",
  ]);

  return {
    id,
    fullName:
      fullName || [firstName, lastName].filter(Boolean).join(" ") || "User",
    email: getRecordValue(raw, ["email", "user_email", "userEmail"]),
    username: getRecordValue(raw, ["username"]) || null,
    avatarUrl:
      getRecordValue(raw, ["avatar_url", "avatarUrl", "picture", "photo"]) ||
      null,
  };
};

const normalizeAuthSession = (raw: unknown): AuthResponse => {
  if (!isRecord(raw)) {
    throw new Error("Session login tidak valid.");
  }

  const rawUser = raw.user || raw.User || raw.profile || raw.account || raw;

  const userId =
    getRecordValue(raw, ["user_id", "userId", "id"]) ||
    getRecordValue(rawUser, ["id", "user_id", "userId"]);

  if (!userId) {
    throw new Error("Session login tidak valid. User ID tidak ditemukan.");
  }

  return {
    userId,
    user: normalizeUser(rawUser, userId),
    accessToken:
      getRecordValue(raw, [
        "token",
        "accessToken",
        "access_token",
        "jwt",
        "access",
      ]) || null,
    refreshToken:
      getRecordValue(raw, ["refreshToken", "refresh_token", "refresh"]) ||
      null,
  };
};

const normalizePurpose = (value: unknown, fallback: VerifyOtpPurpose) => {
  return getString(value).toLowerCase() === "register" ? "register" : fallback;
};

const normalizeOtpTicket = (
  rawPayload: unknown,
  fallbackIdentifier: string,
  fallbackPurpose: VerifyOtpPurpose,
): AuthOtpTicket => {
  const safeIdentifier = fallbackIdentifier.trim();
  const data = getResponseData(rawPayload);

  if (!isRecord(data)) {
    return {
      identifier: safeIdentifier,
      email: safeIdentifier,
      message: getResponseMessage(rawPayload, data, "OTP berhasil dikirim."),
      purpose: fallbackPurpose,
    };
  }

  const responseIdentifier = getRecordValue(data, [
    "identifier",
    "username",
    "email",
    "user_email",
    "userEmail",
  ]);

  const responseEmail = getRecordValue(data, [
    "email",
    "user_email",
    "userEmail",
  ]);

  const identifier =
    responseIdentifier && !isMaskedIdentifier(responseIdentifier)
      ? responseIdentifier
      : safeIdentifier;

  const otpToken = getRecordValue(data, [
    "otpToken",
    "otp_token",
    "otpTicket",
    "otp_ticket",
    "ticket",
    "challengeToken",
    "challenge_token",
  ]);

  const sessionId = getRecordValue(data, [
    "sessionId",
    "session_id",
    "challengeId",
    "challenge_id",
  ]);

  return {
    identifier,
    email: responseEmail || identifier || safeIdentifier,
    message: getResponseMessage(rawPayload, data, "OTP berhasil dikirim."),
    purpose: normalizePurpose(data.purpose, fallbackPurpose),
    otpToken: otpToken || undefined,
    sessionId: sessionId || undefined,
  };
};

const normalizeVerifyOtpResult = (raw: unknown): VerifyOtpResult => {
  const data = getResponseData(raw);

  if (!isRecord(data)) {
    return {
      verified: false,
      message: getResponseMessage(raw, data, "OTP tidak valid."),
      session: null,
    };
  }

  let session: AuthResponse | null = null;

  try {
    session = normalizeAuthSession(data.session || data.auth || data.user || data);
  } catch {
    session = null;
  }

  return {
    verified: Boolean(data.verified ?? data.success ?? session),
    message: getResponseMessage(
      raw,
      data,
      session ? "Verifikasi OTP berhasil." : "OTP tidak valid.",
    ),
    session,
  };
};

const buildVerifyOtpPayload = (payload: VerifyOtpPayload) => {
  const identifier = payload.identifier.trim();
  const otp = payload.otp.trim();

  return {
    identifier,
    otp,
    purpose: payload.purpose || "login",
    otpToken: payload.otpToken,
    otp_token: payload.otpToken,
    sessionId: payload.sessionId,
    session_id: payload.sessionId,
  };
};

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthOtpTicket> => {
    const identifier = payload.identifier.trim();

    const response = await apiClient.post<ApiResponse<unknown>>("/auth/login", {
      identifier,
      password: payload.password,
    });

    return normalizeOtpTicket(response.data, identifier, "login");
  },

  register: async (payload: RegisterPayload): Promise<AuthOtpTicket> => {
    const email = payload.email.trim().toLowerCase();

    const response = await apiClient.post<ApiResponse<unknown>>(
      "/auth/register",
      {
        first_name: payload.first_name.trim(),
        last_name: payload.last_name.trim(),
        place_birth: payload.place_birth.trim(),
        birthdate: payload.birthdate,
        age: String(payload.age),

        job_type_id: Number(payload.job_type_id),
        job_type_name: payload.job_type_name.trim(),

        province_id: Number(payload.province_id),
        city_id: Number(payload.city_id),
        kecamatan_id: Number(payload.kecamatan_id),
        kelurahan_id: Number(payload.kelurahan_id),

        address: payload.address.trim(),
        hobi: payload.hobi.trim(),

        role_id: Number(payload.role_id),

        email,
        username: payload.username.trim().toLowerCase(),
        password: payload.password,
        conf_password: payload.conf_password,

        point_users: String(payload.point_users),
        is_pj: Boolean(payload.is_pj),
        name_jabatan: payload.name_jabatan.trim(),
      },
    );

    return normalizeOtpTicket(response.data, email, "register");
  },

  googleLogin: async (payload: GoogleLoginPayload): Promise<AuthOtpTicket> => {
    const response = await apiClient.post<ApiResponse<unknown>>(
      "/auth/google/callback",
      {
        idToken: payload.idToken,
        id_token: payload.idToken,
        purpose: "login",
        platform: "mobile",
      },
    );

    return normalizeOtpTicket(response.data, "", "login");
  },

  verifyOtp: async (payload: VerifyOtpPayload): Promise<VerifyOtpResult> => {
    const purpose: VerifyOtpPurpose =
      payload.purpose === "register" ? "register" : "login";

    const endpoints =
      purpose === "register"
        ? ["/auth/register/verify-otp", "/auth/login/verify-otp"]
        : ["/auth/login/verify-otp"];

    const body = buildVerifyOtpPayload({ ...payload, purpose });
    let lastError: unknown = null;

    for (const endpoint of endpoints) {
      try {
        const response = await apiClient.post<ApiResponse<unknown>>(
          endpoint,
          body,
        );

        return normalizeVerifyOtpResult(response.data);
      } catch (error) {
        lastError = error;

        if (!shouldFallbackVerifyEndpoint(error)) {
          throw error;
        }
      }
    }

    throw lastError;
  },

  logout: async () => {
    await apiClient.post("/auth/logout");
  },
};
