import { colors, radius, spacing } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  brandArea: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  logo: {
    width: 52,
    height: 40,
  },

  greetingWrap: {
    flex: 1,
    minWidth: 0,
  },

  greetingLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
  },

  greetingName: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: -0.2,
  },

  locationRow: {
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  locationText: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "700",
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: "rgba(255,255,255,0.88)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(15,122,120,0.1)",
  },

  notificationBadge: {
    position: "absolute",
    top: 5,
    right: 5,
    minWidth: 16,
    height: 16,
    borderRadius: radius.full,
    backgroundColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.white,
  },

  notificationBadgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: "900",
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(15,122,120,0.12)",
  },

  actionPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.97 }],
  },
});