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
  VerifyOtpResult,
} from "../types/auth.types";

type AnyRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is AnyRecord => {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
};

const getString = (value: unknown, fallback = "") => {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
};

const unwrapApiResponse = <T>(payload: ApiResponse<T> | T): T => {
  if (isRecord(payload) && "data" in payload) {
    return payload.data as T;
  }

  return payload as T;
};

const isMaskedIdentifier = (value: string) => {
  return value.includes("***") || value.includes("*");
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

  const id =
    getString(raw.id) ||
    getString(raw.user_id) ||
    getString(raw.userId) ||
    fallbackUserId;

  const firstName = getString(raw.first_name) || getString(raw.firstName);
  const lastName = getString(raw.last_name) || getString(raw.lastName);

  const fullName =
    getString(raw.full_name) ||
    getString(raw.fullName) ||
    getString(raw.display_name) ||
    getString(raw.displayName) ||
    getString(raw.name);

  return {
    id,
    fullName:
      fullName || [firstName, lastName].filter(Boolean).join(" ") || "User",
    email: getString(raw.email),
    username: getString(raw.username) || null,
    avatarUrl:
      getString(raw.avatar_url) ||
      getString(raw.avatarUrl) ||
      getString(raw.picture) ||
      null,
  };
};

const normalizeAuthSession = (raw: unknown): AuthResponse => {
  if (!isRecord(raw)) {
    throw new Error("Session login tidak valid.");
  }

  const rawUser = raw.user || raw.User || raw.profile || raw.account || raw;

  const userId =
    getString(raw.user_id) ||
    getString(raw.userId) ||
    getString(raw.id) ||
    (isRecord(rawUser)
      ? getString(rawUser.id) ||
        getString(rawUser.user_id) ||
        getString(rawUser.userId)
      : "");

  if (!userId) {
    throw new Error("Session login tidak valid. User ID tidak ditemukan.");
  }

  return {
    userId,
    user: normalizeUser(rawUser, userId),
  };
};

const normalizeOtpTicket = (
  raw: unknown,
  fallbackIdentifier: string,
  purpose: "login" | "register",
): AuthOtpTicket => {
  const safeIdentifier = fallbackIdentifier.trim();

  if (!isRecord(raw)) {
    return {
      identifier: safeIdentifier,
      email: safeIdentifier,
      message: "OTP berhasil dikirim.",
      purpose,
    };
  }

  const responseIdentifier = getString(raw.identifier);
  const responseEmail = getString(raw.email) || getString(raw.user_email);

  const identifier =
    responseIdentifier && !isMaskedIdentifier(responseIdentifier)
      ? responseIdentifier
      : safeIdentifier;

  return {
    identifier,
    email: responseEmail || safeIdentifier,
    message: getString(raw.message, "OTP berhasil dikirim."),
    purpose,
  };
};

const normalizeVerifyOtpResult = (raw: unknown): VerifyOtpResult => {
  if (!isRecord(raw)) {
    return {
      verified: false,
      message: "OTP tidak valid.",
      session: null,
    };
  }

  let session: AuthResponse | null = null;

  try {
    session = normalizeAuthSession(raw.session || raw.auth || raw.user || raw);
  } catch {
    session = null;
  }

  return {
    verified: Boolean(raw.verified ?? raw.success ?? session),
    message: getString(raw.message, session ? "Verifikasi OTP berhasil." : ""),
    session,
  };
};

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthOtpTicket> => {
    const identifier = payload.identifier.trim();

    const response = await apiClient.post<ApiResponse<unknown>>("/auth/login", {
      identifier,
      password: payload.password,
    });

    const data = unwrapApiResponse(response.data);

    return normalizeOtpTicket(data, identifier, "login");
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

    const data = unwrapApiResponse(response.data);

    return normalizeOtpTicket(data, email, "register");
  },

  googleLogin: async (payload: GoogleLoginPayload): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<unknown>>(
      "/auth/google-login",
      {
        idToken: payload.idToken,
      },
    );

    const data = unwrapApiResponse(response.data);

    return normalizeAuthSession(data);
  },

  verifyOtp: async (payload: VerifyOtpPayload): Promise<VerifyOtpResult> => {
    const identifier = payload.identifier.trim();

    const response = await apiClient.post<ApiResponse<unknown>>(
      "/auth/login/verify-otp",
      {
        identifier,
        otp: payload.otp.trim(),
      },
    );

    const data = unwrapApiResponse(response.data);

    return normalizeVerifyOtpResult(data);
  },

  logout: async () => {
    await apiClient.post("/auth/logout");
  },
};