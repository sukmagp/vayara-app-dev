import { apiClient } from "@/services/api/apiClient";
import type { ApiResponse } from "@/services/api/api.types";
import type { AuthResponse, AuthUser, LoginPayload, RegisterPayload, VerifyOtpPayload } from "../types/auth.types";

export const authService = Object.freeze({
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>("/auth/login", payload);
    return response.data.data;
  },

  async register(payload: RegisterPayload): Promise<{ email: string; message: string }> {
    const response = await apiClient.post<ApiResponse<{ email: string; message: string }>>(
      "/auth/register",
      payload,
    );

    return response.data.data;
  },

  async verifyOtp(payload: VerifyOtpPayload): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>("/auth/verify-otp", payload);
    return response.data.data;
  },

  async me(): Promise<AuthUser> {
    const response = await apiClient.get<ApiResponse<AuthUser>>("/auth/me");
    return response.data.data;
  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
  },
});
