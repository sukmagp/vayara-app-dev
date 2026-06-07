import { useDynamicIsland } from "@/components/ui/DynamicIsland/DynamicIslandAlert";
import { secureStorage } from "@/services/storage/secureStorage";
import { storageKeys } from "@/services/storage/storage.keys";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";

import { authService } from "../services/auth.service";
import { useAuthStore } from "../stores/auth.store";
import type {
  AuthOtpTicket,
  AuthResponse,
  AuthUser,
  LoginPayload,
  RegisterPayload,
  VerifyOtpPayload,
  VerifyOtpResult,
} from "../types/auth.types";

const safeParseUser = (value: string | null): AuthUser | null => {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value);

    if (!parsed || typeof parsed !== "object") return null;
    if (!parsed.id || !parsed.fullName) return null;

    return parsed as AuthUser;
  } catch {
    return null;
  }
};

const removeLegacyTokenStorage = async () => {
  await Promise.allSettled([
    secureStorage.removeItem(storageKeys.accessToken),
    secureStorage.removeItem(storageKeys.refreshToken),
  ]);
};

const persistSession = async (session: AuthResponse) => {
  if (!session.userId || !session.user?.id) {
    throw new Error("Session tidak valid. User tidak ditemukan.");
  }

  await Promise.all([
    secureStorage.setItem(storageKeys.userId, session.userId),
    secureStorage.setItem(storageKeys.authUser, JSON.stringify(session.user)),
  ]);

  await removeLegacyTokenStorage();
};

const clearPersistedSession = async () => {
  await Promise.allSettled([
    secureStorage.removeItem(storageKeys.userId),
    secureStorage.removeItem(storageKeys.authUser),
    secureStorage.removeItem(storageKeys.accessToken),
    secureStorage.removeItem(storageKeys.refreshToken),
  ]);
};

export const useAuth = () => {
  const { showDynamicIsland } = useDynamicIsland();

  const userId = useAuthStore((state) => state.userId);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isBootstrapped = useAuthStore((state) => state.isBootstrapped);

  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);
  const setBootstrapped = useAuthStore((state) => state.setBootstrapped);

  const restoreSession = async () => {
    const storedUserId = await secureStorage.getItem(storageKeys.userId);
    const storedUser = safeParseUser(
      await secureStorage.getItem(storageKeys.authUser),
    );

    await removeLegacyTokenStorage();

    if (storedUserId && storedUser) {
      setSession({
        userId: storedUserId,
        user: {
          ...storedUser,
          id: storedUser.id || storedUserId,
        },
      });

      return;
    }

    await clearPersistedSession();
    clearSession();
    setBootstrapped(true);
  };

  const loginMutation = useMutation<AuthOtpTicket, Error, LoginPayload>({
    mutationFn: (payload) => authService.login(payload),
    onSuccess: (ticket) => {
      router.push({
        pathname: "/(auth)/otp",
        params: {
          identifier: ticket.identifier,
          email: ticket.email || ticket.identifier,
          purpose: ticket.purpose,
        },
      });
    },
  });

  const registerMutation = useMutation<AuthOtpTicket, Error, RegisterPayload>({
    mutationFn: (payload) => authService.register(payload),
    onSuccess: (ticket) => {
      router.replace({
        pathname: "/(auth)/login",
        params: {
          registered: "1",
          email: ticket.email || ticket.identifier,
        },
      });

      setTimeout(() => {
        showDynamicIsland({
          variant: "success",
          title: "Registrasi berhasil",
          message: "Silakan login untuk menerima kode OTP.",
          durationMs: 3600,
        });
      }, 250);
    },
  });

  const verifyOtpMutation = useMutation<
    VerifyOtpResult,
    Error,
    VerifyOtpPayload
  >({
    mutationFn: (payload) => authService.verifyOtp(payload),
    onSuccess: async (result) => {
      if (!result.session) return;

      await persistSession(result.session);
      setSession(result.session);

      router.replace("/(tabs)/home");
    },
  });

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Tetap logout lokal walaupun API logout gagal.
    } finally {
      await clearPersistedSession();
      clearSession();
      router.replace("/(auth)/login");
    }
  };

  return {
    userId,
    user,
    isAuthenticated,
    isBootstrapped,

    restoreSession,

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