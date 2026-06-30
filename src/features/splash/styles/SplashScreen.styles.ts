import { colors, darkColors, radius, spacing } from "@/theme";
import { StyleSheet } from "react-native";

type SplashTheme = typeof colors | typeof darkColors;

export const createSplashScreenStyles = (theme: SplashTheme, isDarkMode = false) =>
  StyleSheet.create({
    root: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: spacing.xl,
      overflow: "hidden",
    },

    decorOne: {
      position: "absolute",
      width: 260,
      height: 260,
      borderRadius: radius.full,
      backgroundColor: theme.decorOne,
      top: -96,
      right: -84,
      opacity: isDarkMode ? 0.82 : 0.9,
    },

    decorTwo: {
      position: "absolute",
      width: 320,
      height: 320,
      borderRadius: radius.full,
      backgroundColor: theme.decorTwo,
      bottom: -132,
      left: -128,
      opacity: isDarkMode ? 0.72 : 0.82,
    },

    decorThree: {
      position: "absolute",
      width: 190,
      height: 190,
      borderRadius: radius.full,
      backgroundColor: theme.decorThree,
      top: "16%",
      left: -96,
      opacity: isDarkMode ? 0.62 : 0.78,
    },

    decorGlow: {
      position: "absolute",
      width: 260,
      height: 260,
      borderRadius: radius.full,
      backgroundColor: theme.primaryMuted,
      top: "31%",
      right: -118,
      opacity: isDarkMode ? 0.52 : 0.44,
    },

    contentWrap: {
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xl,
    },

    logoAura: {
      width: 174,
      height: 174,
      borderRadius: 52,
      padding: 10,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: theme.shadow,
      shadowOpacity: isDarkMode ? 0.36 : 0.24,
      shadowRadius: 34,
      shadowOffset: { width: 0, height: 18 },
      elevation: 12,
    },

    logoFrame: {
      width: "100%",
      height: "100%",
      borderRadius: 44,
      padding: 4,
      alignItems: "center",
      justifyContent: "center",
    },

    logoCard: {
      width: "100%",
      height: "100%",
      borderRadius: 40,
      backgroundColor: theme.glassStrong,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme.glassBorder,
      shadowColor: theme.shadow,
      shadowOpacity: isDarkMode ? 0.22 : 0.16,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 10 },
      elevation: 8,
    },

    logo: {
      width: 112,
      height: 112,
    },

    brandWrap: {
      alignItems: "center",
      marginTop: spacing.xl,
    },

    eyebrow: {
      marginBottom: 8,
      color: theme.textSoft,
      fontSize: 11,
      fontWeight: "900",
      letterSpacing: 2.4,
      textAlign: "center",
    },

    title: {
      color: theme.text,
      fontSize: 44,
      fontWeight: "900",
      letterSpacing: 0.8,
      textAlign: "center",
      textShadowColor: theme.shadow,
      textShadowOffset: { width: 0, height: 8 },
      textShadowRadius: isDarkMode ? 16 : 12,
    },

    subtitle: {
      marginTop: 10,
      color: theme.textMuted,
      fontSize: 14,
      fontWeight: "800",
      letterSpacing: 0.2,
      textAlign: "center",
    },

    gradientLineWrap: {
      marginTop: spacing.lg,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },

    diamond: {
      width: 11,
      height: 11,
      borderRadius: 3,
      transform: [{ rotate: "45deg" }],
      opacity: 0.88,
    },

    gradientLine: {
      width: 128,
      height: 5,
      borderRadius: radius.full,
      opacity: 0.92,
    },

    loadingWrap: {
      position: "absolute",
      left: spacing.xl,
      right: spacing.xl,
      bottom: 54,
      alignItems: "center",
      gap: spacing.md,
    },

    loadingTrack: {
      width: "68%",
      height: 9,
      borderRadius: radius.full,
      backgroundColor: theme.glass,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: theme.glassBorder,
      shadowColor: theme.shadow,
      shadowOpacity: isDarkMode ? 0.22 : 0.12,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 8 },
      elevation: 5,
    },

    loadingFill: {
      width: "78%",
      height: "100%",
      borderRadius: radius.full,
    },

    secureRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: radius.full,
      backgroundColor: theme.glass,
      borderWidth: 1,
      borderColor: theme.glassBorder,
    },

    secureText: {
      color: theme.primary,
      fontSize: 12,
      fontWeight: "900",
      letterSpacing: 0.1,
    },
  });