import { colors, radius, spacing } from "@/theme";
import { Platform, StyleSheet } from "react-native";

type ThemeColors = typeof colors;

const createCardShadow = (theme: ThemeColors) =>
  Platform.select({
    ios: {
      shadowColor: theme.shadow,
      shadowOpacity: 0.1,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 10 },
    },
    android: {
      elevation: 3,
    },
    default: {},
  });

export const createStyles = (theme: ThemeColors = colors) => {
  const cardShadow = createCardShadow(theme);

  return StyleSheet.create({
    card: {
      minHeight: 118,
      borderRadius: 27,
      backgroundColor: theme.card,
      padding: 9,
      flexDirection: "row",
      gap: spacing.md,
      borderWidth: 1,
      borderColor: theme.border,
      ...cardShadow,
    },

    cardPressed: {
      opacity: 0.84,
      transform: [{ scale: 0.99 }],
    },

    image: {
      width: 102,
      height: 100,
      borderRadius: 22,
      backgroundColor: theme.primarySoft,
    },

    content: {
      flex: 1,
      minWidth: 0,
      paddingVertical: 4,
      justifyContent: "space-between",
    },

    titleGroup: {
      gap: 7,
    },

    title: {
      color: theme.text,
      fontSize: 17,
      fontWeight: "900",
      lineHeight: 21,
      letterSpacing: -0.25,
    },

    statusBadge: {
      alignSelf: "flex-start",
      borderRadius: radius.full,
      backgroundColor: theme.accentSoft,
      paddingHorizontal: 11,
      paddingVertical: 5,
      borderWidth: 1,
      borderColor: theme.border,
    },

    statusText: {
      color: theme.accentDark,
      fontSize: 11,
      fontWeight: "900",
      letterSpacing: 0.15,
    },

    metaGroup: {
      gap: 6,
    },

    metaRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 7,
    },

    metaIconWrap: {
      width: 24,
      height: 24,
      borderRadius: radius.full,
      backgroundColor: theme.primaryMuted,
      alignItems: "center",
      justifyContent: "center",
    },

    meta: {
      flex: 1,
      color: theme.textMuted,
      fontSize: 12,
      fontWeight: "900",
    },
  });
};

export const styles = createStyles(colors);
