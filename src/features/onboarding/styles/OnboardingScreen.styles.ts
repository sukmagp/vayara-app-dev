import { Dimensions, StyleSheet } from "react-native";
import { colors, radius, spacing } from "@/theme";

export const screenWidth = Dimensions.get("window").width;

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  slide: {
    width: screenWidth,
    flex: 1,
    backgroundColor: colors.background,
  },
  image: {
    width: screenWidth,
    height: "78%",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 150,
    height: 220,
  },
  copy: {
    position: "absolute",
    left: spacing.xl,
    right: spacing.xl,
    bottom: 120,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: -0.4,
  },
  description: {
    marginTop: spacing.sm,
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
    maxWidth: 290,
  },
  footer: {
    position: "absolute",
    left: spacing.xl,
    right: spacing.xl,
    bottom: 38,
    gap: spacing.lg,
  },
  dots: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: "rgba(0,110,109,0.25)",
  },
  dotActive: {
    width: 32,
    backgroundColor: colors.primary,
  },
  footerAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  skipText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "800",
  },
  nextButton: {
    minWidth: 142,
    minHeight: 48,
  },
});
