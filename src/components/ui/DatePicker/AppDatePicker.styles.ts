import { colors, radius, spacing } from "@/theme";
import { StyleSheet } from "react-native";

export const datePickerStyles = StyleSheet.create({
  wrapper: {
    gap: 7,
  },

  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
  },

  control: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: "rgba(36, 59, 74, 0.12)",
    borderRadius: radius.xl,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
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

  controlDisabled: {
    opacity: 0.65,
  },

  controlError: {
    borderColor: "#E45C5C",
  },

  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(15, 122, 120, 0.08)",
  },

  icon: {
    fontSize: 15,
  },

  value: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },

  placeholder: {
    color: colors.textMuted,
    fontWeight: "600",
  },

  pickerPanel: {
    borderRadius: radius.xl,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(36, 59, 74, 0.1)",
    overflow: "hidden",
  },

  doneButton: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    height: 44,
    borderRadius: radius.xl,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0F7A78",
  },

  doneText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },

  errorText: {
    color: "#E45C5C",
    fontSize: 12,
    fontWeight: "700",
  },
});