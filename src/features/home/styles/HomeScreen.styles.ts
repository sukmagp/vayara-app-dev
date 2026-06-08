import { StyleSheet } from "react-native";

import { colors, radius, spacing } from "@/theme";

export const styles = StyleSheet.create({
  centerContent: {
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },

  content: {
    paddingTop: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingBottom: 120,
  },

  heroCard: {
    marginTop: spacing.xl,
    borderRadius: 34,
    padding: spacing.lg,
    backgroundColor: colors.primary,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 14 },
    elevation: 4,
  },

  heroOrnamentOne: {
    position: "absolute",
    width: 132,
    height: 132,
    borderRadius: 66,
    top: -50,
    right: -34,
    backgroundColor: "rgba(255,255,255,0.12)",
  },

  heroOrnamentTwo: {
    position: "absolute",
    width: 88,
    height: 88,
    borderRadius: 44,
    bottom: -34,
    left: -24,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  heroEyebrow: {
    alignSelf: "flex-start",
    minHeight: 28,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.14)",
  },

  heroEyebrowText: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 11,
    fontWeight: "900",
  },

  heroTitle: {
    marginTop: spacing.md,
    color: colors.white,
    fontSize: 29,
    fontWeight: "900",
    letterSpacing: -0.5,
    lineHeight: 35,
  },

  heroSubtitle: {
    marginTop: 8,
    color: "rgba(255,255,255,0.82)",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
  },

  heroStatsRow: {
    marginTop: spacing.lg,
    flexDirection: "row",
    gap: spacing.sm,
  },

  heroStatCard: {
    flex: 1,
    minHeight: 58,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
  },

  heroStatValue: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "900",
  },

  heroStatLabel: {
    marginTop: 2,
    color: "rgba(255,255,255,0.74)",
    fontSize: 10,
    fontWeight: "800",
  },

  searchBox: {
    marginTop: spacing.lg,
    minHeight: 54,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.94)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: "rgba(15,122,120,0.1)",
    shadowColor: colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },

  searchPressed: {
    opacity: 0.76,
    transform: [{ scale: 0.99 }],
  },

  searchPlaceholder: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "800",
  },

  searchShortcut: {
    minHeight: 28,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(15,122,120,0.08)",
  },

  searchShortcutText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "900",
  },

  categoryList: {
    gap: spacing.md,
    paddingRight: spacing.xl,
  },

  recommendationList: {
    gap: spacing.md,
    paddingRight: spacing.xl,
  },

  listEmptyCard: {
    minHeight: 104,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.78)",
    borderWidth: 1,
    borderColor: "rgba(15,122,120,0.08)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },

  listEmptyText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 18,
  },

  tripList: {
    gap: spacing.md,
  },

  bottomSpacer: {
    height: 28,
  },
});