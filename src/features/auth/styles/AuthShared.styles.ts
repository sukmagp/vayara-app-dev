import { colors, radius, spacing, type AppThemeColors } from "@/theme";
import { StyleSheet } from "react-native";

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export const createAuthSharedStyles = (
  theme: AppThemeColors,
  width = 390,
  height = 844,
) => {
  const horizontalPadding = clamp(width * 0.065, 22, 32);
  const isDarkMode = theme.background === "#152425";

  return StyleSheet.create({
    gradientRoot: {
      flex: 1,
      width,
      minHeight: height,
      backgroundColor: theme.background,
      overflow: "hidden",
    },

    backgroundImage: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 0,
    },

    backgroundImageLayer: {
      opacity: 1,
    },

    backgroundImageScrim: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: isDarkMode ? "rgba(10, 24, 25, 0.10)" : "rgba(247, 250, 247, 0.02)",
    },

    decorOne: {
      position: "absolute",
      zIndex: 1,
      width: clamp(width * 0.82, 280, 380),
      height: clamp(width * 0.82, 280, 380),
      borderRadius: radius.full,
      top: -clamp(width * 0.45, 152, 214),
      right: -clamp(width * 0.34, 118, 165),
      backgroundColor: theme.decorOne,
      opacity: 0,
    },

    decorTwo: {
      position: "absolute",
      zIndex: 1,
      width: clamp(width * 1.08, 360, 500),
      height: clamp(width * 1.08, 360, 500),
      borderRadius: radius.full,
      bottom: -clamp(width * 0.58, 190, 270),
      left: -clamp(width * 0.5, 170, 240),
      backgroundColor: theme.decorTwo,
      opacity: 0,
    },

    decorThree: {
      position: "absolute",
      zIndex: 1,
      width: clamp(width * 0.62, 210, 290),
      height: clamp(width * 0.62, 210, 290),
      borderRadius: radius.full,
      top: height * 0.36,
      right: -clamp(width * 0.32, 108, 150),
      backgroundColor: theme.decorThree,
      opacity: 0,
    },

    keyboardAvoidingView: {
      flex: 1,
      zIndex: 2,
      backgroundColor: "transparent",
    },

    keyboardScrollView: {
      flex: 1,
      backgroundColor: "transparent",
    },

    loginScrollContent: {
      flexGrow: 1,
      minHeight: height,
      justifyContent: "flex-end",
      paddingTop: clamp(height * 0.055, 42, 64),
      backgroundColor: "transparent",
    },

    registerScrollContent: {
      flexGrow: 1,
      minHeight: height,
      justifyContent: "flex-end",
      paddingTop: clamp(height * 0.05, 38, 58),
      backgroundColor: "transparent",
    },

    heroWrap: {
      flex: 1,
      minHeight: clamp(height * 0.28, 215, 300),
      paddingHorizontal: horizontalPadding,
      paddingTop: clamp(height * 0.035, 26, 42),
      paddingBottom: spacing.lg,
      justifyContent: "center",
      alignItems: "center",
    },

    heroCompact: {
      minHeight: clamp(height * 0.18, 140, 190),
      paddingHorizontal: horizontalPadding,
      paddingTop: clamp(height * 0.03, 24, 38),
      paddingBottom: spacing.md,
      justifyContent: "center",
      alignItems: "center",
    },

    logoAura: {
      width: 112,
      height: 112,
      borderRadius: 36,
      padding: 3,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: theme.shadow,
      shadowOpacity: isDarkMode ? 0.32 : 0.2,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: 12 },
      elevation: 7,
    },

    logoCard: {
      width: "100%",
      height: "100%",
      borderRadius: 33,
      backgroundColor: theme.glassStrong,
      borderWidth: 1,
      borderColor: theme.glassBorder,
      alignItems: "center",
      justifyContent: "center",
    },

    logoImage: {
      width: 72,
      height: 72,
    },

    heroTitle: {
      marginTop: spacing.lg,
      color: theme.text,
      fontSize: clamp(width * 0.082, 30, 38),
      lineHeight: clamp(width * 0.095, 37, 46),
      fontWeight: "900",
      textAlign: "center",
      letterSpacing: -0.8,
      textShadowColor: isDarkMode ? "rgba(0, 0, 0, 0.28)" : "rgba(255, 255, 255, 0.44)",
      textShadowOffset: { width: 0, height: 6 },
      textShadowRadius: 14,
    },

    heroSubtitle: {
      marginTop: spacing.sm,
      color: theme.textMuted,
      fontSize: clamp(width * 0.036, 13, 15),
      lineHeight: clamp(width * 0.055, 20, 23),
      fontWeight: "800",
      textAlign: "center",
      maxWidth: 320,
      textShadowColor: isDarkMode ? "rgba(0, 0, 0, 0.22)" : "rgba(255, 255, 255, 0.44)",
      textShadowOffset: { width: 0, height: 4 },
      textShadowRadius: 10,
    },

    authSheet: {
      width: "100%",
      backgroundColor: theme.authCard,
      borderTopLeftRadius: clamp(width * 0.1, 34, 46),
      borderTopRightRadius: clamp(width * 0.1, 34, 46),
      borderWidth: 1,
      borderBottomWidth: 0,
      borderColor: theme.glassBorder,
      paddingHorizontal: horizontalPadding,
      paddingTop: spacing.xl,
      paddingBottom: clamp(height * 0.038, 30, 44),
      shadowColor: theme.shadow,
      shadowOpacity: isDarkMode ? 0.24 : 0.15,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: -5 },
      elevation: 10,
    },

    registerSheet: {
      width: "100%",
      backgroundColor: theme.authCard,
      borderTopLeftRadius: clamp(width * 0.1, 34, 46),
      borderTopRightRadius: clamp(width * 0.1, 34, 46),
      borderWidth: 1,
      borderBottomWidth: 0,
      borderColor: theme.glassBorder,
      paddingHorizontal: horizontalPadding,
      paddingTop: spacing.xl,
      paddingBottom: clamp(height * 0.04, 34, 50),
      shadowColor: theme.shadow,
      shadowOpacity: isDarkMode ? 0.22 : 0.14,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: -5 },
      elevation: 10,
    },

    sheetHandle: {
      width: 54,
      height: 5,
      borderRadius: radius.full,
      alignSelf: "center",
      backgroundColor: theme.primaryMuted,
      marginBottom: spacing.lg,
    },

    sheetTitle: {
      color: theme.text,
      fontSize: clamp(width * 0.075, 28, 36),
      lineHeight: clamp(width * 0.09, 36, 44),
      fontWeight: "900",
      textAlign: "center",
      letterSpacing: -0.8,
    },

    sheetSubtitle: {
      marginTop: 8,
      color: theme.textMuted,
      fontSize: clamp(width * 0.036, 13, 15),
      lineHeight: clamp(width * 0.055, 20, 23),
      fontWeight: "800",
      textAlign: "center",
      alignSelf: "center",
      maxWidth: 330,
    },

    formWrap: {
      marginTop: spacing.xl,
      gap: spacing.md,
    },

    inputGroup: {
      gap: 6,
    },

    inputContainer: {
      minHeight: 56,
      borderRadius: radius.xl,
      paddingHorizontal: 16,
      backgroundColor: theme.input,
      borderWidth: 1.2,
      borderColor: theme.inputBorder,
      flexDirection: "row",
      alignItems: "center",
      shadowColor: theme.shadow,
      shadowOpacity: isDarkMode ? 0.12 : 0.07,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 5 },
      elevation: 2,
    },

    inputContainerFocused: {
      borderColor: theme.inputBorderFocused,
      backgroundColor: isDarkMode ? theme.input : theme.white,
    },

    inputContainerError: {
      borderColor: theme.danger,
      backgroundColor: theme.dangerSoft,
    },

    inputContainerMultiline: {
      minHeight: 92,
      paddingVertical: 14,
      alignItems: "flex-start",
    },

    inputIcon: {
      width: 26,
      marginRight: 10,
      alignItems: "center",
      justifyContent: "center",
    },

    textInput: {
      flex: 1,
      minHeight: 54,
      paddingVertical: 0,
      color: theme.text,
      fontSize: 15,
      fontWeight: "800",
    },

    textInputMultiline: {
      minHeight: 66,
      paddingTop: 0,
      textAlignVertical: "top",
    },

    secureButton: {
      width: 38,
      height: 38,
      borderRadius: radius.full,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 6,
    },

    fieldErrorText: {
      color: theme.danger,
      fontSize: 11,
      fontWeight: "800",
      lineHeight: 16,
      paddingHorizontal: 4,
    },

    forgotButton: {
      alignSelf: "flex-end",
      marginTop: -4,
      paddingVertical: 4,
      paddingHorizontal: 2,
    },

    forgotText: {
      color: theme.primary,
      fontSize: 12,
      fontWeight: "900",
    },

    errorBox: {
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
      lineHeight: 18,
    },

    primaryButtonWrap: {
      marginTop: spacing.xs,
      minHeight: 56,
      borderRadius: radius.full,
      overflow: "hidden",
      shadowColor: theme.shadow,
      shadowOpacity: isDarkMode ? 0.22 : 0.16,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 6,
    },

    primaryButtonGradient: {
      minHeight: 56,
      borderRadius: radius.full,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: spacing.xl,
      borderWidth: 1,
      borderColor: isDarkMode ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.56)",
    },

    primaryButtonText: {
      color: theme.gradientBarIcon,
      fontSize: 15,
      fontWeight: "900",
      letterSpacing: 0.2,
    },

    primaryButtonPressed: {
      transform: [{ scale: 0.985 }],
      opacity: 0.92,
    },

    primaryButtonDisabled: {
      opacity: 0.58,
    },

    dividerWrap: {
      marginTop: spacing.sm,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },

    divider: {
      flex: 1,
      height: 1,
      backgroundColor: theme.border,
      opacity: isDarkMode ? 0.8 : 0.7,
    },

    dividerText: {
      color: theme.textMuted,
      fontSize: 11,
      fontWeight: "800",
    },

    socialButton: {
      minHeight: 54,
      borderRadius: radius.full,
      backgroundColor: isDarkMode ? theme.input : theme.white,
      borderWidth: 1,
      borderColor: theme.inputBorder,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      shadowColor: theme.shadow,
      shadowOpacity: isDarkMode ? 0.12 : 0.1,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 3,
    },

    socialButtonText: {
      color: theme.text,
      fontSize: 14,
      fontWeight: "900",
      letterSpacing: 0.1,
    },

    bottomTextWrap: {
      marginTop: spacing.xs,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "wrap",
    },

    bottomText: {
      color: theme.textMuted,
      fontSize: 12,
      fontWeight: "800",
    },

    bottomLink: {
      color: theme.primary,
      fontSize: 12,
      fontWeight: "900",
    },

    linkPressed: {
      opacity: 0.72,
      transform: [{ scale: 0.98 }],
    },

    actionDisabled: {
      opacity: 0.5,
    },
  });
};

export const authSharedStyles = createAuthSharedStyles(colors);
