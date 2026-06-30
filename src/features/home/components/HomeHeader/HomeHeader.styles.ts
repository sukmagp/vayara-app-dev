import { colors, spacing } from "@/theme";
import { Platform, StyleSheet } from "react-native";

type ThemeColors = typeof colors;

const createButtonShadow = (theme: ThemeColors) =>
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
  const buttonShadow = createButtonShadow(theme);

  return StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.md,
    },

    greetingWrap: {
      flex: 1,
      minWidth: 0,
    },

    greetingLabel: {
      color: theme.textMuted,
      fontWeight: "800",
      letterSpacing: -0.2,
    },

    greetingName: {
      marginTop: 1,
      color: theme.text,
      fontWeight: "900",
      letterSpacing: -0.35,
    },

    actions: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },

    actionsSmall: {
      gap: 7,
    },

    circleButton: {
      backgroundColor: theme.glassStrong,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme.glassBorder,
      ...buttonShadow,
    },

    notificationBadge: {
      position: "absolute",
      top: -2,
      right: -2,
      backgroundColor: theme.danger,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 4,
      borderWidth: 2,
      borderColor: theme.card,
    },

    notificationBadgeText: {
      color: theme.white,
      fontSize: 10,
      fontWeight: "900",
      lineHeight: 12,
    },

    actionPressed: {
      opacity: 0.78,
      transform: [{ scale: 0.96 }],
    },
  });
};

export const styles = createStyles(colors);
