import { StyleSheet } from "react-native";
import { colors, radius } from "@/theme";

export const styles = StyleSheet.create({
  card: {
    width: 74,
    alignItems: "center",
    gap: 7,
  },
  iconWrap: {
    width: 64,
    height: 58,
    borderRadius: radius.lg,
    backgroundColor: colors.mintSoft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: {
    color: colors.text,
    fontSize: 10,
    fontWeight: "800",
    textAlign: "center",
  },
});
