import DateTimePicker, {
    type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useMemo, useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { datePickerStyles } from "./AppDatePicker.styles";

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
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
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

  return `${pad(date.getDate())} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
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
          disabled && datePickerStyles.controlDisabled,
          error && datePickerStyles.controlError,
        ]}
      >
        <View style={datePickerStyles.iconWrap}>
          <Text style={datePickerStyles.icon}>📅</Text>
        </View>

        <Text
          numberOfLines={1}
          style={[
            datePickerStyles.value,
            !displayValue && datePickerStyles.placeholder,
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
            <Pressable onPress={closePicker} style={datePickerStyles.doneButton}>
              <Text style={datePickerStyles.doneText}>Selesai</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}

      {error ? <Text style={datePickerStyles.errorText}>{error}</Text> : null}
    </View>
  );
}

