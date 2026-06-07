import { StyleSheet } from "react-native";

import { colors, radius, spacing } from "@/theme";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },

  hero: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 330,
    backgroundColor: colors.background,
  },

  heroImage: {
    width: "100%",
    height: "124%",
  },

  heroOverlay: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingTop: 150,
  },

  card: {
    minHeight: 540,
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 8,
  },

  logo: {
    width: 82,
    height: 68,
    alignSelf: "center",
    marginBottom: spacing.sm,
  },

  header: {
    alignItems: "center",
    gap: 6,
  },

  title: {
    color: colors.text,
    fontSize: 25,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: -0.3,
  },

  subtitle: {
    maxWidth: 300,
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 19,
    textAlign: "center",
  },

  form: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
});