import { colors, radius, spacing } from "@/theme";
import { Dimensions, StyleSheet } from "react-native";

const { height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },

  hero: {
    width: "100%",
    height: Math.min(430, height * 0.52),
    backgroundColor: colors.mintSoft,
  },

  heroImage: {
    width: "100%",
    height: "100%",
  },

  heroOverlay: {
    flex: 1,
  },

  card: {
    flex: 1,
    marginTop: -34,
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    alignItems: "center",
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: -6,
    },
    elevation: 8,
  },

  title: {
    color: colors.text,
    fontSize: 25,
    fontWeight: "900",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 6,
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 19,
    maxWidth: 290,
  },

  emailText: {
    color: colors.primary,
    fontWeight: "900",
  },

  otpRow: {
    marginTop: spacing.xl,
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.sm,
  },

  otpInput: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
  },

  otpInputFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.mintSoft,
  },

  errorText: {
    marginTop: spacing.md,
    color: colors.danger,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },

  resendText: {
    marginTop: spacing.lg,
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
  },

  resendLink: {
    color: colors.primary,
    fontWeight: "900",
  },

  timerText: {
    marginTop: 5,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },

  button: {
    width: "100%",
    marginTop: spacing.xl,
  },

  backText: {
    marginTop: spacing.md,
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "800",
  },

  resendButton: {
    marginTop: spacing.lg,
  },

  resendLinkDisabled: {
    color: colors.textMuted,
    opacity: 0.55,
  },
  resendWrap: {
    marginTop: spacing.lg,
    alignItems: "center",
    gap: 5,
  },

  resendTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center",
  },

  resendDescription: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },

  backButton: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.lg,
  },
});