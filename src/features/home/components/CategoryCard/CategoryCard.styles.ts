import { colors, spacing } from "@/theme";
import { Platform, StyleSheet } from "react-native";

type ThemeColors = typeof colors;

const createSoftShadow = (theme: ThemeColors) =>
  Platform.select({
    ios: {
      shadowColor: theme.shadow,
      shadowOpacity: 0.12,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 8 },
    },
    android: {
      elevation: 3,
    },
    default: {},
  });

export const createStyles = (theme: ThemeColors = colors) => {
  const softShadow = createSoftShadow(theme);

  return StyleSheet.create({
    card: {
      alignItems: "center",
      gap: 8,
    },

    cardPressed: {
      opacity: 0.82,
      transform: [{ scale: 0.97 }],
    },

    iconWrap: {
      backgroundColor: theme.glassStrong,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme.glassBorder,
      ...softShadow,
    },

    text: {
      minHeight: 30,
      paddingHorizontal: spacing.xs,
      fontWeight: "900",
      textAlign: "center",
      letterSpacing: -0.1,
    },
  });
};

export const styles = createStyles(colors);
