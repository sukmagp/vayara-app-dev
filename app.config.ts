/// <reference types="node" />

import type { ExpoConfig } from "expo/config";

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
  },

  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#FFF8EC",
    },
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
  ],

  extra: {
    appName: process.env.EXPO_PUBLIC_APP_NAME ?? "Vayara",
    appEnv: process.env.EXPO_PUBLIC_APP_ENV ?? "development",
    apiBaseUrl:
      process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:3001/api",
    apiTimeoutMs: Number(process.env.EXPO_PUBLIC_API_TIMEOUT_MS ?? 30000),
  },
};

export default config;