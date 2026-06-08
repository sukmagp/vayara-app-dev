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
    borderColor: colors.danger,
  },

  iconWrap: {
    width: 24,
    height: 24,
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
    fontWeight: "400",
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
    backgroundColor: colors.primary,
  },

  doneText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },

  errorText: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: "700",
  },
});

export const authDatePickerFieldStyles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },

  field: {
    minHeight: 64,
    width: "100%",
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "transparent",
    paddingHorizontal: 22,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  fieldPressed: {
    borderColor: "rgba(15, 122, 120, 0.28)",
    transform: [{ scale: 0.996 }],
  },

  fieldError: {
    borderColor: colors.danger,
  },

  fieldDisabled: {
    opacity: 0.58,
  },

  iconWrap: {
    width: 24,
    alignItems: "flex-start",
    justifyContent: "center",
    marginRight: 12,
  },

  icon: {
    color: colors.textMuted,
  },

  text: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    fontWeight: "400",
  },

  placeholder: {
    color: colors.textMuted,
  },

  errorText: {
    marginTop: spacing.xs,
    color: colors.danger,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.36)",
    justifyContent: "flex-end",
  },

  modalCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: spacing.lg,
    overflow: "hidden",
  },

  modalHeader: {
    minHeight: 56,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  modalTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
  },

  modalCancelText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "800",
  },

  modalDoneText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "900",
  },

  iosPicker: {
    width: "100%",
  },
});