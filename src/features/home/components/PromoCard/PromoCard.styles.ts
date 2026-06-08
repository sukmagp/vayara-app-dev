import { colors, radius, spacing } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    width: 232,
    height: 172,
    borderRadius: 30,
    overflow: "hidden",
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.72)",
    shadowColor: colors.shadow,
    shadowOpacity: 0.09,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 3,
  },

  cardPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.985 }],
  },

  imageWrap: {
    flex: 1,
  },

  image: {
    borderRadius: 30,
  },

  overlay: {
    flex: 1,
    justifyContent: "space-between",
    padding: spacing.md,
    backgroundColor: "rgba(0, 34, 36, 0.30)",
  },

  badge: {
    alignSelf: "flex-start",
    minHeight: 28,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.92)",
  },

  badgeText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: "900",
  },

  copy: {
    gap: 4,
  },

  title: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 24,
    letterSpacing: -0.3,
  },

  subtitle: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 16,
  },
});