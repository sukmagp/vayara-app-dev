/// <reference types="node" />

import type { ExpoConfig } from "expo/config";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  "https://backend-super-apps-travel-96zp.vercel.app/api/v1";

const PROJECT_ID = "6f8b4f52-f6c2-4a9b-9c3d-bb4d633f1994";

const config: ExpoConfig = {
  name: process.env.EXPO_PUBLIC_APP_NAME ?? "Vayara",
  slug: "vayara-app",
  scheme: "vayara",
  version: "1.0.0",
  orientation: "portrait",
  userInterfaceStyle: "automatic",

  icon: "./assets/images/app-icon.png",

  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.vayara.travel",
  },

  android: {
    package: "com.vayara.travel",
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#FFF8EC",
    },
  },

  updates: {
    url: `https://u.expo.dev/${PROJECT_ID}`,
  },

  runtimeVersion: {
    policy: "appVersion",
  },

  plugins: [
    "expo-router",
    "expo-secure-store",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#FFF8EC",
        image: "./assets/images/splash-icon.png",
        imageWidth: 180,
      },
    ],

    // Aktifkan lagi nanti kalau Google Auth sudah ready.
    // [
    //   "@react-native-google-signin/google-signin",
    //   {
    //     iosUrlScheme: "com.googleusercontent.apps.REVERSED_IOS_CLIENT_ID",
    //   },
    // ],
  ],

  extra: {
    appName: process.env.EXPO_PUBLIC_APP_NAME ?? "Vayara",
    appEnv: process.env.EXPO_PUBLIC_APP_ENV ?? "development",
    apiBaseUrl: API_BASE_URL,
    apiTimeoutMs: Number(process.env.EXPO_PUBLIC_API_TIMEOUT_MS ?? 30000),

    eas: {
      projectId: PROJECT_ID,
    },
  },
};

export default config;