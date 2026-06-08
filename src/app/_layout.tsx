import { colors } from "@/theme";
import { Stack } from "expo-router";

import { AppProviders } from "@/providers/AppProvider";

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade_from_bottom",
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      />
    </AppProviders>
  );
}