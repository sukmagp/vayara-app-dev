import { colors, radius, spacing } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
 button: {
    minHeight: 54,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "rgba(36, 59, 74, 0.12)",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.04,
    shadowRadius: 14,
    elevation: 2,
  },

  buttonPressed: {
    opacity: 0.84,
    transform: [{ scale: 0.99 }],
  },

  buttonDisabled: {
    opacity: 0.62,
  },

  iconWrap: {
    width: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
  },
});
