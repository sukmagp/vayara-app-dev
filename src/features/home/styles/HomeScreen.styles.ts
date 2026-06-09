import { colors, spacing } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  centerContent: {
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },

  list: {
    flex: 1,
    backgroundColor: "#FFF8EE",
  },

  content: {
    paddingBottom: 116,
    backgroundColor: "#FFF8EE",
  },

  topPanel: {
    position: "relative",
    paddingHorizontal: spacing.xl,
    paddingBottom: 49,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    overflow: "hidden",
  },

  topPanelGlowOne: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    top: -70,
    right: -48,
    backgroundColor: "rgba(255,255,255,0.09)",
  },

  topPanelGlowTwo: {
    position: "absolute",
    width: 118,
    height: 118,
    borderRadius: 59,
    bottom: -62,
    left: -44,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  categoryList: {
    paddingTop: 22,
    paddingRight: spacing.xl,
  },

  body: {
    marginTop: -31,
    paddingHorizontal: spacing.xl,
  },

  searchBox: {
    minHeight: 48,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.98)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: "rgba(15,122,120,0.08)",
    shadowColor: colors.shadow,
    shadowOpacity: 0.07,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },

  searchPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },

  searchPlaceholder: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "800",
  },

  headerAfterSearch: {
    paddingTop: 6,
  },

  recommendationList: {
    gap: spacing.md,
    paddingRight: spacing.xl,
  },

  recommendationCard: {
    width: 256,
    height: 168,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "rgba(15,122,120,0.1)",
    borderWidth: 1,
    borderColor: "rgba(15,122,120,0.08)",
  },

  recommendationPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.985 }],
  },

  recommendationImage: {
    width: "100%",
    height: "100%",
  },

  recommendationOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    padding: spacing.lg,
    backgroundColor: "rgba(0,0,0,0.18)",
  },

  recommendationBadge: {
    alignSelf: "flex-start",
    maxWidth: "86%",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: "rgba(255,255,255,0.9)",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  recommendationBadgeText: {
    flexShrink: 1,
    color: colors.primary,
    fontSize: 12,
    fontWeight: "900",
  },

  recommendationCopy: {
    gap: 5,
  },

  recommendationTitle: {
    color: colors.white,
    fontSize: 25,
    fontWeight: "900",
    letterSpacing: -0.35,
  },

  recommendationSubtitle: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 18,
  },

  listEmptyCard: {
    minHeight: 96,
    borderRadius: 24,
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

  topDealsList: {
    paddingHorizontal: spacing.xl,
  },

  topDealsRow: {
    flexDirection: "row",
    marginBottom: spacing.md,
  },

  topDealItem: {
    flex: 1,
  },

  topDealItemSpacer: {
    marginRight: spacing.md,
  },

  topDealPlaceholder: {
    flex: 1,
  },

  topDealsFooter: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
  },

  topDealsFooterText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "900",
  },

  bottomSpacer: {
    height: 20,
  },
});