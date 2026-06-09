import { colors, spacing } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  greetingWrap: {
    flex: 1,
    minWidth: 0,
  },

  greetingLabel: {
    color: "rgba(255,255,255,0.82)",
    fontWeight: "800",
    letterSpacing: -0.2,
  },

  greetingName: {
    marginTop: 0,
    color: colors.white,
    fontWeight: "900",
    letterSpacing: -0.35,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  actionsSmall: {
    gap: 7,
  },

  circleButton: {
    backgroundColor: "rgba(255,255,255,0.96)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.55)",
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },

  notificationBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: colors.white,
  },

  notificationBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "900",
    lineHeight: 12,
  },

  actionPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.96 }],
  },
});