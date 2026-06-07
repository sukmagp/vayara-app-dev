import { Platform } from "react-native";

import { env } from "@/config/env";

type GoogleSigninModule = typeof import("@react-native-google-signin/google-signin");

let isConfigured = false;
let googleModulePromise: Promise<GoogleSigninModule> | null = null;

export class GoogleAuthError extends Error {
  code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = "GoogleAuthError";
    this.code = code;
  }
}

const isNativeModuleMissingError = (error: unknown) => {
  const message =
    error instanceof Error ? error.message : typeof error === "string" ? error : "";

  return (
    message.includes("RNGoogleSignin") ||
    message.includes("TurboModuleRegistry") ||
    message.includes("NativeGoogleSignin")
  );
};

const loadGoogleSigninModule = async () => {
  try {
    if (!googleModulePromise) {
      googleModulePromise = import("@react-native-google-signin/google-signin");
    }

    return await googleModulePromise;
  } catch (error) {
    googleModulePromise = null;

    if (isNativeModuleMissingError(error)) {
      throw new GoogleAuthError(
        "Google Sign-In belum tersedia di native app ini. Gunakan Development Build/EAS Build, bukan Expo Go.",
        "NATIVE_MODULE_UNAVAILABLE",
      );
    }

    throw new GoogleAuthError("Gagal memuat Google Sign-In.", "MODULE_LOAD_FAILED");
  }
};

export const configureGoogleAuth = async () => {
  const googleModule = await loadGoogleSigninModule();

  if (isConfigured) return googleModule;

  if (!env.googleWebClientId) {
    throw new GoogleAuthError(
      "Google Web Client ID belum dikonfigurasi di env.",
      "MISSING_GOOGLE_WEB_CLIENT_ID",
    );
  }

  googleModule.GoogleSignin.configure({
    webClientId: env.googleWebClientId,
    iosClientId: env.googleIosClientId || undefined,
    offlineAccess: false,
    forceCodeForRefreshToken: false,
  });

  isConfigured = true;

  return googleModule;
};

export const signInWithGoogle = async () => {
  const googleModule = await configureGoogleAuth();
  const { GoogleSignin, isErrorWithCode, isSuccessResponse, statusCodes } =
    googleModule;

  try {
    if (Platform.OS === "android") {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
    }

    const response = await GoogleSignin.signIn();

    if (!isSuccessResponse(response)) {
      throw new GoogleAuthError("Login Google dibatalkan.", "SIGN_IN_CANCELLED");
    }

    const idToken = response.data.idToken;

    if (!idToken) {
      throw new GoogleAuthError(
        "Google ID token tidak tersedia. Pastikan Web Client ID sudah benar.",
        "GOOGLE_ID_TOKEN_EMPTY",
      );
    }

    return {
      idToken,
      user: response.data.user,
    };
  } catch (error) {
    if (error instanceof GoogleAuthError) {
      throw error;
    }

    if (isNativeModuleMissingError(error)) {
      throw new GoogleAuthError(
        "Google Sign-In belum tersedia di native app ini. Gunakan Development Build/EAS Build, bukan Expo Go.",
        "NATIVE_MODULE_UNAVAILABLE",
      );
    }

    if (isErrorWithCode(error)) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        throw new GoogleAuthError("Login Google dibatalkan.", error.code);
      }

      if (error.code === statusCodes.IN_PROGRESS) {
        throw new GoogleAuthError("Login Google sedang diproses.", error.code);
      }

      if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new GoogleAuthError(
          "Google Play Services tidak tersedia atau perlu diperbarui.",
          error.code,
        );
      }

      throw new GoogleAuthError("Login Google gagal.", error.code);
    }

    throw new GoogleAuthError("Login Google gagal.", "UNKNOWN_GOOGLE_ERROR");
  }
};

export const signOutFromGoogle = async () => {
  try {
    const googleModule = await configureGoogleAuth();
    await googleModule.GoogleSignin.signOut();
  } catch {
    // Silent by design: logout lokal tetap harus jalan.
  }
};