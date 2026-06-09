import { colors, spacing } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    gap: 7,
  },

  cardPressed: {
    opacity: 0.76,
    transform: [{ scale: 0.97 }],
  },

  iconWrap: {
    backgroundColor: "rgba(255,255,255,0.96)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.58)",
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },

  text: {
    minHeight: 28,
    paddingHorizontal: spacing.xs,
    fontWeight: "900",
    textAlign: "center",
  },
});