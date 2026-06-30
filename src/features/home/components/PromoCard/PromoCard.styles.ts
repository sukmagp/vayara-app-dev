import { colors, radius, spacing } from "@/theme";
import { Platform, StyleSheet } from "react-native";

type ThemeColors = typeof colors;

const createCardShadow = (theme: ThemeColors) =>
  Platform.select({
    ios: {
      shadowColor: theme.shadow,
      shadowOpacity: 0.14,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 12 },
    },
    android: {
      elevation: 4,
    },
    default: {},
  });

export const createStyles = (theme: ThemeColors = colors) => {
  const cardShadow = createCardShadow(theme);

  return StyleSheet.create({
    card: {
      width: 232,
      height: 172,
      borderRadius: 30,
      overflow: "hidden",
      backgroundColor: theme.primarySoft,
      borderWidth: 1,
      borderColor: theme.glassBorder,
      ...cardShadow,
    },

    cardPressed: {
      opacity: 0.84,
      transform: [{ scale: 0.985 }],
    },

    imageWrap: {
      flex: 1,
    },

    image: {
      borderRadius: 30,
    },

    overlay: {
      flex: 1,
      justifyContent: "space-between",
      padding: spacing.md,
      backgroundColor: "rgba(21, 36, 37, 0.38)",
    },

    badge: {
      alignSelf: "flex-start",
      minHeight: 28,
      borderRadius: radius.full,
      paddingHorizontal: 10,
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.62)",
    },

    badgeText: {
      color: colors.primaryDark,
      fontSize: 10,
      fontWeight: "900",
    },

    copy: {
      gap: 4,
    },

    title: {
      color: theme.white,
      fontSize: 20,
      fontWeight: "900",
      lineHeight: 24,
      letterSpacing: -0.3,
    },

    subtitle: {
      color: "rgba(255, 255, 255, 0.9)",
      fontSize: 12,
      fontWeight: "800",
      lineHeight: 16,
    },
  });
};

export const styles = createStyles(colors);
