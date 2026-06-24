export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  username?: string | null;
  avatarUrl?: string | null;
};

export type LoginPayload = {
  identifier: string;
  password: string;
};

export type GoogleLoginPayload = {
  idToken: string;
};

export type RegisterPayload = {
  first_name: string;
  last_name: string;
  place_birth: string;
  birthdate: string;
  age: string;

  job_type_id: number;
  job_type_name: string;

  province_id: number;
  city_id: number;
  kecamatan_id: number;
  kelurahan_id: number;

  address: string;
  hobi: string;

  role_id: number;

  email: string;
  username: string;
  password: string;
  conf_password: string;

  point_users: string;
  is_pj: boolean;
  name_jabatan: string;
};

export type VerifyOtpPurpose = "login" | "register";

export type VerifyOtpPayload = {
  identifier: string;
  otp: string;
  purpose?: VerifyOtpPurpose;
  otpToken?: string;
  sessionId?: string;
};

export type AuthOtpTicket = {
  identifier: string;
  email?: string;
  message: string;
  purpose: VerifyOtpPurpose;
  otpToken?: string;
  sessionId?: string;
  callbackParams?: Record<string, string>;
};

export type AuthResponse = {
  userId: string;
  user: AuthUser;
  accessToken?: string | null;
  refreshToken?: string | null;
};

export type VerifyOtpResult = {
  verified: boolean;
  message: string;
  session: AuthResponse | null;
};

export type AuthState = {
  userId: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isBootstrapped: boolean;
};
