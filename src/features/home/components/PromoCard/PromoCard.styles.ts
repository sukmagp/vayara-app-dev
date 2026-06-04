import { StyleSheet } from "react-native";
import { colors, radius, spacing } from "@/theme";

export const styles = StyleSheet.create({
  promoCard: {
    width: 240,
    height: 132,
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.primary,
  },
  promoImageWrap: {
    flex: 1,
    justifyContent: "flex-end",
  },
  promoImage: {
    borderRadius: radius.lg,
  },
  promoOverlay: {
    padding: spacing.lg,
    backgroundColor: "rgba(0, 55, 54, 0.36)",
  },
  promoTitle: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "900",
  },
  promoSubtitle: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 2,
  },
  dealCard: {
    width: 180,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    overflow: "hidden",
  },
  dealImage: {
    width: "100%",
    height: 92,
  },
  dealContent: {
    padding: spacing.md,
  },
  dealTitle: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: "900",
  },
  dealSubtitle: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 3,
  },
});
