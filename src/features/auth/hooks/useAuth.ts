import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { secureStorage } from "@/services/storage/secureStorage";
import { storageKeys } from "@/services/storage/storage.keys";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../stores/auth.store";
import type { AuthResponse, LoginPayload, RegisterPayload, VerifyOtpPayload } from "../types/auth.types";

const persistSession = async (session: AuthResponse) => {
  await secureStorage.setItem(storageKeys.accessToken, session.accessToken);

  if (session.refreshToken) {
    await secureStorage.setItem(storageKeys.refreshToken, session.refreshToken);
  }
};

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: async (session) => {
      await persistSession(session);
      setSession({ user: session.user, accessToken: session.accessToken });
      router.replace("/(tabs)/home");
    },
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: (result) => {
      router.push({ pathname: "/(auth)/otp", params: { email: result.email } });
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (payload: VerifyOtpPayload) => authService.verifyOtp(payload),
    onSuccess: async (session) => {
      await persistSession(session);
      setSession({ user: session.user, accessToken: session.accessToken });
      router.replace("/(tabs)/home");
    },
  });

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // intentionally ignore logout API failure, local session still must be cleared
    } finally {
      await secureStorage.removeItem(storageKeys.accessToken);
      await secureStorage.removeItem(storageKeys.refreshToken);
      clearSession();
      router.replace("/(auth)/login");
    }
  };

  return {
    user,
    isAuthenticated,
    login: loginMutation.mutateAsync,
    loginLoading: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutateAsync,
    registerLoading: registerMutation.isPending,
    registerError: registerMutation.error,
    verifyOtp: verifyOtpMutation.mutateAsync,
    verifyOtpLoading: verifyOtpMutation.isPending,
    verifyOtpError: verifyOtpMutation.error,
    logout,
  };
};
