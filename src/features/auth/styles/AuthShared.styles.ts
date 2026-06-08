import { colors, spacing } from "@/theme";
import { StyleSheet } from "react-native";

export const authSharedStyles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardScrollView: {
    flex: 1,
  },
  keyboardScrollContent: {
    flexGrow: 1,
  },

  forgotButton: {
    alignSelf: "flex-end",
    marginTop: -2,
  },
  forgotText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
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
    backgroundColor: colors.border,
  },
  dividerText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "700",
  },
  bottomTextWrap: {
    marginTop: spacing.xs,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  bottomLink: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "900",
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
  },
  
});