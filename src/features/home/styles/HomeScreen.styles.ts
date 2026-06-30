import { colors, spacing } from "@/theme";
import { Platform, StyleSheet } from "react-native";

type ThemeColors = typeof colors;

const createFloatingShadow = (theme: ThemeColors, opacity = 0.12, elevation = 4) =>
  Platform.select({
    ios: {
      shadowColor: theme.shadow,
      shadowOpacity: opacity,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 12 },
    },
    android: {
      elevation,
    },
    default: {},
  });

export const createStyles = (theme: ThemeColors = colors) => {
  const floatingShadow = createFloatingShadow(theme);
  const softShadow = createFloatingShadow(theme, 0.08, 2);

  return StyleSheet.create({
    centerContent: {
      justifyContent: "center",
      paddingHorizontal: spacing.xl,
      backgroundColor: theme.background,
    },

    list: {
      flex: 1,
      backgroundColor: theme.background,
    },

    content: {
      paddingBottom: 116,
      backgroundColor: theme.background,
    },

    topPanel: {
      position: "relative",
      paddingHorizontal: spacing.xl,
      paddingBottom: 48,
      backgroundColor: theme.card,
      borderBottomLeftRadius: 38,
      borderBottomRightRadius: 38,
      borderWidth: 1,
      borderTopWidth: 0,
      borderColor: theme.glassBorder,
      overflow: "hidden",
      ...softShadow,
    },

    topPanelGlowOne: {
      position: "absolute",
      width: 188,
      height: 188,
      borderRadius: 94,
      top: -92,
      right: -58,
      backgroundColor: theme.decorTwo,
    },

    topPanelGlowTwo: {
      position: "absolute",
      width: 156,
      height: 156,
      borderRadius: 78,
      bottom: -78,
      left: -50,
      backgroundColor: theme.decorOne,
    },

    topPanelGlowThree: {
      position: "absolute",
      width: 124,
      height: 124,
      borderRadius: 62,
      top: 76,
      left: "42%",
      backgroundColor: theme.decorThree,
    },

    categoryList: {
      paddingTop: 24,
      paddingRight: spacing.xl,
    },

    body: {
      marginTop: -30,
      paddingHorizontal: spacing.xl,
    },

    searchBox: {
      minHeight: 52,
      borderRadius: 21,
      backgroundColor: theme.glassStrong,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.lg,
      gap: spacing.sm,
      borderWidth: 1,
      borderColor: theme.glassBorder,
      ...floatingShadow,
    },

    searchPressed: {
      opacity: 0.84,
      transform: [{ scale: 0.99 }],
    },

    searchPlaceholder: {
      flex: 1,
      color: theme.textMuted,
      fontSize: 14,
      fontWeight: "800",
    },

    headerAfterSearch: {
      paddingTop: 6,
    },

    recommendationList: {
      gap: spacing.md,
      paddingRight: spacing.xl,
    },

    recommendationCard: {
      width: 256,
      height: 170,
      borderRadius: 28,
      overflow: "hidden",
      backgroundColor: theme.primarySoft,
      borderWidth: 1,
      borderColor: theme.glassBorder,
      ...floatingShadow,
    },

    recommendationPressed: {
      opacity: 0.84,
      transform: [{ scale: 0.985 }],
    },

    recommendationImage: {
      width: "100%",
      height: "100%",
    },

    recommendationOverlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: "space-between",
      padding: spacing.lg,
      backgroundColor: "rgba(21, 36, 37, 0.34)",
    },

    recommendationBadge: {
      alignSelf: "flex-start",
      maxWidth: "86%",
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 7,
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.62)",
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },

    recommendationBadgeText: {
      flexShrink: 1,
      color: colors.primaryDark,
      fontSize: 12,
      fontWeight: "900",
    },

    recommendationCopy: {
      gap: 5,
    },

    recommendationTitle: {
      color: theme.white,
      fontSize: 25,
      fontWeight: "900",
      letterSpacing: -0.35,
    },

    recommendationSubtitle: {
      color: "rgba(255, 255, 255, 0.92)",
      fontSize: 14,
      fontWeight: "900",
      lineHeight: 18,
    },

    listEmptyCard: {
      minHeight: 98,
      borderRadius: 25,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: "center",
      justifyContent: "center",
      padding: spacing.lg,
      ...floatingShadow,
    },

    listEmptyText: {
      color: theme.textMuted,
      fontSize: 13,
      fontWeight: "800",
      textAlign: "center",
      lineHeight: 18,
    },

    tripList: {
      gap: spacing.md,
    },

    topDealsList: {
      paddingHorizontal: spacing.xl,
    },

    topDealsRow: {
      flexDirection: "row",
      marginBottom: spacing.md,
    },

    topDealItem: {
      flex: 1,
      minWidth: 0,
    },

    topDealItemSpacer: {
      marginRight: spacing.md,
    },

    topDealPlaceholder: {
      flex: 1,
    },

    topDealsFooter: {
      minHeight: 52,
      alignItems: "center",
      justifyContent: "center",
    },

    topDealsFooterText: {
      color: theme.textMuted,
      fontSize: 12,
      fontWeight: "900",
    },

    bottomSpacer: {
      height: 20,
    },
  });
};

export const styles = createStyles(colors);
