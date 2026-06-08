import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import type { ComponentProps } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Keyboard,
  Modal,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";

import {
  authDatePickerFieldStyles,
  datePickerStyles,
} from "./AppDatePicker.styles";

type IconName = ComponentProps<typeof Ionicons>["name"];

type AppDatePickerProps = {
  label?: string;
  value?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  minimumDate?: Date;
  maximumDate?: Date;
  onChange: (value: string) => void;
  onBlur?: () => void;
};

type AuthDatePickerFieldProps = {
  value?: string;
  placeholder?: string;
  icon?: IconName;
  error?: string;
  disabled?: boolean;
  minimumDate?: Date;
  maximumDate?: Date;
  onChange?: (value: string) => void;
  onBlur?: () => void;
};

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const pad = (value: number) => String(value).padStart(2, "0");

export const toDateInputValue = (date: Date) => {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}`;
};

export const parseDateInputValue = (value?: string) => {
  if (!value) return null;

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(year, month - 1, day);

  const isValid =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  return isValid ? date : null;
};

export const calculateAgeFromBirthdate = (birthdate?: string) => {
  const birthDate = parseDateInputValue(birthdate);
  if (!birthDate) return null;

  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const hasBirthdayPassedThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  if (!hasBirthdayPassedThisYear) {
    age -= 1;
  }

  return age >= 0 ? age : null;
};

const formatDisplayDate = (date: Date | null) => {
  if (!date) return "";

  return `${pad(date.getDate())} ${
    MONTHS[date.getMonth()]
  } ${date.getFullYear()}`;
};

const formatAuthDateLabel = (value?: string) => {
  const date = parseDateInputValue(value);

  if (!date) return "";

  return `${pad(date.getDate())}/${pad(
    date.getMonth() + 1,
  )}/${date.getFullYear()}`;
};

export function AppDatePicker({
  label,
  value,
  placeholder = "Pilih tanggal",
  error,
  disabled = false,
  minimumDate,
  maximumDate = new Date(),
  onChange,
  onBlur,
}: AppDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedDate = useMemo(() => parseDateInputValue(value), [value]);

  const pickerValue = selectedDate || maximumDate || new Date();
  const displayValue = formatDisplayDate(selectedDate);

  const openPicker = () => {
    if (disabled) return;
    Keyboard.dismiss();
    setIsOpen(true);
  };

  const closePicker = () => {
    setIsOpen(false);
    onBlur?.();
  };

  const handleChange = (
    event: DateTimePickerEvent,
    nextDate?: Date | undefined,
  ) => {
    if (Platform.OS === "android") {
      setIsOpen(false);
    }

    if (event.type === "dismissed") {
      onBlur?.();
      return;
    }

    if (!nextDate) return;

    onChange(toDateInputValue(nextDate));

    if (Platform.OS === "android") {
      onBlur?.();
    }
  };

  return (
    <View style={datePickerStyles.wrapper}>
      {label ? <Text style={datePickerStyles.label}>{label}</Text> : null}

      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPress={openPicker}
        style={[
          datePickerStyles.control,
          disabled ? datePickerStyles.controlDisabled : null,
          error ? datePickerStyles.controlError : null,
        ]}
      >
        <View style={datePickerStyles.iconWrap}>
          <Text style={datePickerStyles.icon}>📅</Text>
        </View>

        <Text
          numberOfLines={1}
          style={[
            datePickerStyles.value,
            !displayValue ? datePickerStyles.placeholder : null,
          ]}
        >
          {displayValue || placeholder}
        </Text>
      </Pressable>

      {isOpen ? (
        <View style={datePickerStyles.pickerPanel}>
          <DateTimePicker
            value={pickerValue}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            onChange={handleChange}
          />

          {Platform.OS === "ios" ? (
            <Pressable
              onPress={closePicker}
              style={datePickerStyles.doneButton}
            >
              <Text style={datePickerStyles.doneText}>Selesai</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}

      {error ? <Text style={datePickerStyles.errorText}>{error}</Text> : null}
    </View>
  );
}

export function AuthDatePickerField({
  value,
  placeholder = "Pilih tanggal",
  icon = "calendar-outline",
  error,
  disabled = false,
  minimumDate,
  maximumDate,
  onChange,
  onBlur,
}: AuthDatePickerFieldProps) {
  const selectedDate = useMemo(() => parseDateInputValue(value), [value]);

  const [pickerVisible, setPickerVisible] = useState(false);
  const [draftDate, setDraftDate] = useState<Date>(
    selectedDate || maximumDate || new Date(),
  );

  useEffect(() => {
    if (selectedDate) {
      setDraftDate(selectedDate);
    }
  }, [selectedDate]);

  const displayText = useMemo(() => formatAuthDateLabel(value), [value]);

  const closePicker = useCallback(() => {
    setPickerVisible(false);
    onBlur?.();
  }, [onBlur]);

  const openPicker = useCallback(() => {
    if (disabled) return;

    Keyboard.dismiss();
    setPickerVisible(true);
  }, [disabled]);

  const commitDate = useCallback(
    (date: Date) => {
      onChange?.(toDateInputValue(date));
      onBlur?.();
    },
    [onBlur, onChange],
  );

  const handleAndroidChange = useCallback(
    (event: DateTimePickerEvent, selected?: Date) => {
      setPickerVisible(false);

      if (event.type === "dismissed" || !selected) {
        onBlur?.();
        return;
      }

      setDraftDate(selected);
      commitDate(selected);
    },
    [commitDate, onBlur],
  );

  const handleIosChange = useCallback(
    (_event: DateTimePickerEvent, selected?: Date) => {
      if (!selected) return;
      setDraftDate(selected);
    },
    [],
  );

  const handleIosConfirm = useCallback(() => {
    commitDate(draftDate);
    setPickerVisible(false);
  }, [commitDate, draftDate]);

  return (
    <View style={authDatePickerFieldStyles.wrapper}>
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPress={openPicker}
        style={({ pressed }) => [
          authDatePickerFieldStyles.field,
          error ? authDatePickerFieldStyles.fieldError : null,
          disabled ? authDatePickerFieldStyles.fieldDisabled : null,
          pressed && !disabled
            ? authDatePickerFieldStyles.fieldPressed
            : null,
        ]}
      >
        <View style={authDatePickerFieldStyles.iconWrap}>
          <Ionicons
            name={icon}
            size={24}
            style={authDatePickerFieldStyles.icon}
          />
        </View>

        <Text
          numberOfLines={1}
          style={[
            authDatePickerFieldStyles.text,
            !displayText ? authDatePickerFieldStyles.placeholder : null,
          ]}
        >
          {displayText || placeholder}
        </Text>
      </Pressable>

      {error ? (
        <Text style={authDatePickerFieldStyles.errorText}>{error}</Text>
      ) : null}

      {Platform.OS === "android" && pickerVisible ? (
        <DateTimePicker
          value={draftDate}
          mode="date"
          display="default"
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onChange={handleAndroidChange}
        />
      ) : null}

      {Platform.OS === "ios" ? (
        <Modal
          transparent
          visible={pickerVisible}
          animationType="fade"
          onRequestClose={closePicker}
        >
          <Pressable
            style={authDatePickerFieldStyles.modalBackdrop}
            onPress={closePicker}
          >
            <Pressable style={authDatePickerFieldStyles.modalCard}>
              <View style={authDatePickerFieldStyles.modalHeader}>
                <Pressable
                  accessibilityRole="button"
                  onPress={closePicker}
                  hitSlop={10}
                >
                  <Text style={authDatePickerFieldStyles.modalCancelText}>
                    Batal
                  </Text>
                </Pressable>

                <Text style={authDatePickerFieldStyles.modalTitle}>
                  Pilih tanggal
                </Text>

                <Pressable
                  accessibilityRole="button"
                  onPress={handleIosConfirm}
                  hitSlop={10}
                >
                  <Text style={authDatePickerFieldStyles.modalDoneText}>
                    Selesai
                  </Text>
                </Pressable>
              </View>

              {pickerVisible ? (
                <DateTimePicker
                  value={draftDate}
                  mode="date"
                  display="spinner"
                  minimumDate={minimumDate}
                  maximumDate={maximumDate}
                  onChange={handleIosChange}
                  style={authDatePickerFieldStyles.iosPicker}
                />
              ) : null}
            </Pressable>
          </Pressable>
        </Modal>
      ) : null}
    </View>
  );
}