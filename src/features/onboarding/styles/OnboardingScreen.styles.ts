import { radius, spacing, type AppThemeColors } from "@/theme";
import { StyleSheet } from "react-native";

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export const createOnboardingScreenStyles = (
  theme: AppThemeColors,
  width: number,
  height: number,
  isDarkMode = false,
) => {
  const horizontalPadding = clamp(width * 0.07, 22, 34);
  const contentCardHeight = clamp(height * 0.35, 302, 374);
  const titleSize = clamp(width * 0.088, 30, 38);

  return StyleSheet.create({
    root: {
      flex: 1,
      width,
      height,
      backgroundColor: theme.background,
      overflow: "hidden",
    },

    mediaPager: {
      ...StyleSheet.absoluteFillObject,
    },

    mediaSlide: {
      width,
      height,
      backgroundColor: theme.background,
      overflow: "hidden",
    },

    backgroundGradient: {
      ...StyleSheet.absoluteFillObject,
    },

    fullImage: {
      ...StyleSheet.absoluteFillObject,
      width,
      height,
    },

imageScrim: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: theme.overlay,
  opacity: isDarkMode ? 0.42 : 0.12,
},

    topImageOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: height * 0.24,
      opacity: isDarkMode ? 0.38 : 0.2,
    },

    bottomImageOverlay: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: contentCardHeight - 100,
      height: height * 0.24,
    },

    orbTop: {
      position: "absolute",
      width: width * 0.92,
      height: width * 0.92,
      borderRadius: radius.full,
      backgroundColor: theme.decorTwo,
      top: -width * 0.46,
      right: -width * 0.34,
      opacity: isDarkMode ? 0.28 : 0.24,
    },

    orbLeft: {
      position: "absolute",
      width: width * 0.7,
      height: width * 0.36,
      borderRadius: radius.full,
      backgroundColor: theme.decorOne,
      top: height * 0.18,
      left: -width * 0.26,
      opacity: isDarkMode ? 0.18 : 0.2,
      transform: [{ rotate: "-18deg" }],
    },

    orbRight: {
      position: "absolute",
      width: width * 0.62,
      height: width * 0.32,
      borderRadius: radius.full,
      backgroundColor: theme.decorThree,
      top: height * 0.31,
      right: -width * 0.2,
      opacity: isDarkMode ? 0.14 : 0.18,
      transform: [{ rotate: "19deg" }],
    },

    header: {
      position: "absolute",
      top: clamp(height * 0.052, 42, 58),
      left: horizontalPadding,
      right: horizontalPadding,
      zIndex: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
    },

    skipButton: {
      paddingHorizontal: 20,
      paddingVertical: 11,
      borderRadius: radius.full,
      backgroundColor: theme.glassStrong,
      borderWidth: 1,
      borderColor: theme.glassBorder,
      shadowColor: theme.shadow,
      shadowOpacity: isDarkMode ? 0.28 : 0.12,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
      elevation: 6,
    },

    skipButtonPlaceholder: {
      width: 84,
      height: 42,
    },

    skipText: {
      color: theme.text,
      fontSize: 14,
      fontWeight: "900",
    },

    contentCard: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      width,
      minHeight: contentCardHeight,
      paddingHorizontal: horizontalPadding,
      paddingTop: 24,
      paddingBottom: clamp(height * 0.044, 30, 42),
      backgroundColor: theme.authCard,
      borderTopLeftRadius: 42,
      borderTopRightRadius: 42,
      borderWidth: 1,
      borderBottomWidth: 0,
      borderColor: theme.glassBorder,
      shadowColor: theme.shadow,
shadowOpacity: isDarkMode ? 0.2 : 0.12,
shadowRadius: 18,
shadowOffset: { width: 0, height: -4 },
elevation: 10,
      zIndex: 9,
      overflow: "hidden",
    },

    contentCardGradient: {
      ...StyleSheet.absoluteFillObject,
      borderTopLeftRadius: 42,
      borderTopRightRadius: 42,
    },

    cardAccentLine: {
      position: "absolute",
      top: 0,
      left: horizontalPadding + 18,
      right: horizontalPadding + 18,
      height: 2,
      borderRadius: radius.full,
      opacity: isDarkMode ? 0.48 : 0.62,
    },

    handle: {
      width: 54,
      height: 5,
      borderRadius: radius.full,
      alignSelf: "center",
      backgroundColor: theme.primaryMuted,
      marginBottom: 22,
    },

    title: {
      color: theme.text,
      fontSize: titleSize,
      lineHeight: titleSize + 6,
      fontWeight: "900",
      letterSpacing: -0.9,
      textAlign: "center",
      textShadowColor: isDarkMode ? theme.shadow : "transparent",
      textShadowOffset: { width: 0, height: 8 },
      textShadowRadius: isDarkMode ? 14 : 0,
    },

    description: {
      marginTop: spacing.md,
      color: theme.textMuted,
      fontSize: clamp(width * 0.037, 14, 16),
      lineHeight: clamp(width * 0.057, 21, 24),
      fontWeight: "700",
      textAlign: "center",
      alignSelf: "center",
      maxWidth: 336,
    },

    dots: {
      marginTop: 24,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 9,
    },

    dot: {
      width: 9,
      height: 9,
      borderRadius: radius.full,
      backgroundColor: theme.dot,
      opacity: 0.62,
    },

    dotActive: {
      width: 36,
      backgroundColor: theme.primary,
      opacity: 1,
    },

    primaryButtonWrap: {
      marginTop: 28,
      borderRadius: radius.full,
      overflow: "hidden",
      shadowColor: theme.shadow,
      shadowOpacity: isDarkMode ? 0.3 : 0.2,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 12 },
      elevation: 8,
    },

    primaryButton: {
      minHeight: 58,
      borderRadius: radius.full,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: spacing.xl,
      borderWidth: 1,
      borderColor: isDarkMode ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.52)",
    },

    primaryButtonText: {
      color: theme.gradientBarIcon,
      fontSize: 16,
      fontWeight: "900",
      letterSpacing: 0.2,
    },

    emptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: horizontalPadding,
      backgroundColor: theme.background,
    },

    emptyTitle: {
      color: theme.text,
      fontSize: 22,
      fontWeight: "900",
      textAlign: "center",
    },

    emptyDescription: {
      marginTop: spacing.sm,
      color: theme.textMuted,
      fontSize: 14,
      fontWeight: "700",
      textAlign: "center",
    },

    emptyButton: {
      marginTop: spacing.xl,
      minHeight: 50,
      minWidth: 140,
      borderRadius: radius.full,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.primary,
      shadowColor: theme.shadow,
      shadowOpacity: 0.18,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 6,
    },

    emptyButtonText: {
      color: theme.gradientBarIcon,
      fontSize: 15,
      fontWeight: "900",
    },
  });
};