import { colors, radius, spacing } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    minHeight: 132,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.92)",
    padding: spacing.sm,
    flexDirection: "row",
    gap: spacing.md,
    borderWidth: 1,
    borderColor: "rgba(15,122,120,0.08)",
    shadowColor: colors.shadow,
    shadowOpacity: 0.07,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },

  cardPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },

  image: {
    width: 108,
    height: 112,
    borderRadius: 22,
  },

  content: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 6,
    justifyContent: "space-between",
  },

  titleRow: {
    gap: 8,
  },

  title: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "900",
    lineHeight: 20,
    letterSpacing: -0.2,
  },

  metaGroup: {
    gap: 7,
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
    fontWeight: "800",
  },

  statusBadge: {
    alignSelf: "flex-start",
    borderRadius: radius.full,
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  statusText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.2,
  },
});