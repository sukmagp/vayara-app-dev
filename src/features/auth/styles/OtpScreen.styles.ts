import { colors, radius, spacing, type AppThemeColors } from "@/theme";
import { StyleSheet } from "react-native";

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export const createOtpScreenStyles = (
  theme: AppThemeColors,
  width = 390,
  height = 844,
) => {
  const horizontalPadding = clamp(width * 0.07, 22, 34);
  const heroHeight = clamp(height * 0.43, 292, 410);
  const titleSize = clamp(width * 0.068, 24, 31);
  const otpSize = clamp((width - horizontalPadding * 2 - spacing.sm * 5) / 6, 42, 54);
  const isDarkMode = theme.background === "#152425";

  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.background,
      overflow: "hidden",
    },

    backgroundGradient: {
      ...StyleSheet.absoluteFillObject,
    },

    decorOne: {
      position: "absolute",
      width: width * 0.8,
      height: width * 0.8,
      borderRadius: radius.full,
      top: -width * 0.42,
      right: -width * 0.32,
      backgroundColor: theme.decorOne,
      opacity: isDarkMode ? 0.34 : 0.62,
    },

    decorTwo: {
      position: "absolute",
      width: width * 1.1,
      height: width * 1.1,
      borderRadius: radius.full,
      bottom: -width * 0.6,
      left: -width * 0.48,
      backgroundColor: theme.decorTwo,
      opacity: isDarkMode ? 0.24 : 0.48,
    },

    hero: {
      width: "100%",
      height: heroHeight,
      backgroundColor: theme.mintSoft,
      overflow: "hidden",
    },

    heroImage: {
      width: "100%",
      height: "100%",
    },

    heroOverlay: {
      flex: 1,
      backgroundColor: theme.overlay,
      opacity: isDarkMode ? 0.44 : 0.16,
    },

    heroTopFade: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: heroHeight * 0.24,
      opacity: isDarkMode ? 0.36 : 0.18,
    },

    heroBottomFade: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: -1,
      height: heroHeight * 0.32,
    },

    card: {
      flex: 1,
      marginTop: -34,
      backgroundColor: theme.authCard,
      borderTopLeftRadius: clamp(width * 0.1, 34, 46),
      borderTopRightRadius: clamp(width * 0.1, 34, 46),
      borderWidth: 1,
      borderBottomWidth: 0,
      borderColor: theme.glassBorder,
      paddingHorizontal: horizontalPadding,
      paddingTop: spacing.xl,
      paddingBottom: spacing.xxl,
      alignItems: "center",
      shadowColor: theme.shadow,
      shadowOpacity: isDarkMode ? 0.22 : 0.13,
      shadowRadius: 20,
      shadowOffset: {
        width: 0,
        height: -5,
      },
      elevation: 9,
    },

    handle: {
      width: 52,
      height: 5,
      borderRadius: radius.full,
      backgroundColor: theme.primaryMuted,
      marginBottom: spacing.lg,
    },

    title: {
      color: theme.text,
      fontSize: titleSize,
      lineHeight: titleSize + 5,
      fontWeight: "900",
      textAlign: "center",
      letterSpacing: -0.5,
    },

    subtitle: {
      marginTop: 8,
      color: theme.textMuted,
      fontSize: 13,
      fontWeight: "800",
      textAlign: "center",
      lineHeight: 20,
      maxWidth: 310,
    },

    emailText: {
      color: theme.primary,
      fontWeight: "900",
    },

    otpRow: {
      width: "100%",
      marginTop: spacing.xl,
      flexDirection: "row",
      justifyContent: "center",
      gap: spacing.sm,
    },

    otpInput: {
      width: otpSize,
      height: otpSize,
      borderRadius: radius.lg,
      backgroundColor: theme.input,
      borderWidth: 1.2,
      borderColor: theme.inputBorder,
      color: theme.text,
      fontSize: clamp(width * 0.052, 18, 22),
      fontWeight: "900",
      textAlign: "center",
      shadowColor: theme.shadow,
      shadowOpacity: isDarkMode ? 0.14 : 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 5 },
      elevation: 2,
    },

    otpInputFilled: {
      borderColor: theme.primary,
      backgroundColor: theme.primarySoft,
    },

    errorBox: {
      width: "100%",
      marginTop: spacing.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.lg,
      backgroundColor: theme.dangerSoft,
      borderWidth: 1,
      borderColor: isDarkMode ? "rgba(255, 119, 119, 0.32)" : "rgba(217, 74, 74, 0.24)",
    },

    errorText: {
      color: theme.danger,
      fontSize: 12,
      fontWeight: "800",
      textAlign: "center",
      lineHeight: 18,
    },

    resendText: {
      color: theme.text,
      fontSize: 13,
      fontWeight: "800",
      textAlign: "center",
    },

    resendLink: {
      color: theme.primary,
      fontWeight: "900",
    },

    timerText: {
      marginTop: 6,
      color: theme.textMuted,
      fontSize: 12,
      fontWeight: "800",
      textAlign: "center",
    },

    gradientButtonWrap: {
      width: "100%",
      marginTop: spacing.xl,
      borderRadius: radius.full,
      overflow: "hidden",
      shadowColor: theme.shadow,
      shadowOpacity: isDarkMode ? 0.24 : 0.16,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 6,
    },

    gradientButton: {
      minHeight: 56,
      borderRadius: radius.full,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: spacing.xl,
      borderWidth: 1,
      borderColor: isDarkMode ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.56)",
    },

    gradientButtonText: {
      color: theme.gradientBarIcon,
      fontSize: 15,
      fontWeight: "900",
      letterSpacing: 0.2,
    },

    gradientButtonPressed: {
      transform: [{ scale: 0.985 }],
      opacity: 0.92,
    },

    gradientButtonDisabled: {
      opacity: 0.58,
    },

    backText: {
      marginTop: spacing.md,
      color: theme.textMuted,
      fontSize: 13,
      fontWeight: "900",
    },

    resendButton: {
      marginTop: spacing.lg,
    },

    resendLinkDisabled: {
      color: theme.textMuted,
      opacity: 0.55,
    },

    backButton: {
      minHeight: 44,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: radius.lg,
    },
  });
};

export const styles = createOtpScreenStyles(colors);