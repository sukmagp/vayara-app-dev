import { colors, radius, spacing } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    minHeight: 118,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.94)",
    padding: 9,
    flexDirection: "row",
    gap: spacing.md,
    borderWidth: 1,
    borderColor: "rgba(15,122,120,0.08)",
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 7 },
    elevation: 2,
  },

  cardPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },

  image: {
    width: 102,
    height: 100,
    borderRadius: 20,
    backgroundColor: "rgba(15,122,120,0.08)",
  },

  content: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 4,
    justifyContent: "space-between",
  },

  titleGroup: {
    gap: 7,
  },

  title: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: "900",
    lineHeight: 21,
    letterSpacing: -0.25,
  },

  statusBadge: {
    alignSelf: "flex-start",
    borderRadius: radius.full,
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },

  statusText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.15,
  },

  metaGroup: {
    gap: 6,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  metaIconWrap: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: "rgba(15,122,120,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  meta: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "900",
  },
});