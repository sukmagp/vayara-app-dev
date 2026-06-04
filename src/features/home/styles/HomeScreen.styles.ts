import { StyleSheet } from "react-native";
import { colors, radius, spacing } from "@/theme";

export const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingBottom: 120,
  },
  heroText: {
    marginTop: spacing.xl,
  },
  heroTitle: {
    color: colors.primary,
    fontSize: 25,
    fontWeight: "900",
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "800",
    marginTop: 2,
  },
  searchBox: {
    marginTop: spacing.lg,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.92)",
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  searchPlaceholder: {
    color: colors.textSoft,
    fontSize: 14,
    fontWeight: "700",
  },
  categoryList: {
    gap: spacing.sm,
    paddingRight: spacing.xl,
  },
  promoList: {
    gap: spacing.md,
    paddingRight: spacing.xl,
  },
  bottomSpacer: {
    height: 24,
  },
});
