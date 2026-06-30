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
      flex: 1,
      overflow: "hidden",
      borderRadius: 23,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      ...cardShadow,
    },

    cardPressed: {
      opacity: 0.84,
      transform: [{ scale: 0.99 }],
    },

    imageWrap: {
      position: "relative",
      height: 138,
      backgroundColor: theme.primarySoft,
    },

    image: {
      width: "100%",
      height: "100%",
    },

    tagBadge: {
      position: "absolute",
      left: 9,
      top: 9,
      maxWidth: "78%",
      borderRadius: radius.full,
      paddingHorizontal: 9,
      paddingVertical: 5,
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.62)",
    },

    tagText: {
      color: colors.primaryDark,
      fontSize: 10,
      fontWeight: "900",
    },

    discountBadge: {
      position: "absolute",
      right: 9,
      bottom: -17,
      minWidth: 42,
      height: 34,
      borderRadius: radius.full,
      backgroundColor: theme.danger,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 8,
      borderWidth: 3,
      borderColor: theme.card,
    },

    discountText: {
      color: theme.white,
      fontSize: 12,
      fontWeight: "900",
    },

    content: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md,
      paddingBottom: spacing.md,
    },

    title: {
      color: theme.text,
      fontSize: 14,
      fontWeight: "900",
      letterSpacing: -0.15,
    },

    location: {
      marginTop: 2,
      color: theme.textMuted,
      fontSize: 10,
      fontWeight: "800",
    },

    starText: {
      marginTop: 7,
      color: theme.warning,
      fontSize: 10,
      fontWeight: "900",
      letterSpacing: 0.7,
    },

    reviewRow: {
      marginTop: 7,
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 3,
    },

    ratingText: {
      color: theme.primaryDark,
      fontSize: 10,
      fontWeight: "900",
    },

    reviewText: {
      color: theme.textMuted,
      fontSize: 10,
      fontWeight: "700",
    },

    originalPrice: {
      marginTop: 8,
      color: theme.textMuted,
      fontSize: 10,
      fontWeight: "700",
      textDecorationLine: "line-through",
    },

    price: {
      marginTop: 3,
      color: theme.accentDark,
      fontSize: 13,
      fontWeight: "900",
    },
  });
};

export const styles = createStyles(colors);
