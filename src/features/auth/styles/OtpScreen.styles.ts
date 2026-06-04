import { StyleSheet } from "react-native";
import { colors, radius, spacing } from "@/theme";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  hero: {
    flex: 1,
    minHeight: 350,
  },
  heroOverlay: {
    flex: 1,
  },
  card: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: 36,
    alignItems: "center",
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
    maxWidth: 280,
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
});
