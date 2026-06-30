import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
} from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  useWindowDimensions,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Screen } from "@/components/layout/Screen";
import { colors } from "@/theme";

import { useFlightTicketBooking } from "../../hooks/FlightTicket/useFlightTicketBooking";
import {
  BAGGAGE_OPTIONS,
  CABIN_CLASS_OPTIONS,
  FLIGHT_DATE_OPTIONS,
  PAYMENT_METHODS,
  PROTECTION_OPTIONS,
} from "../../services/FlightTicket/flight-ticket.mock";
import { flightTicketService, normalizePassengers } from "../../services/FlightTicket/flight-ticket.service";
import type {
  AirportOption,
  BaggageOption,
  CabinClass,
  CabinClassOption,
  FlightOrder,
  FlightSchedule,
  FlightSearchForm,
  PassengerCounts,
  PassengerKey,
  PaymentMethod,
  ProtectionOption,
  TripType,
} from "../../types/FlightTicket/flight-ticket.types";
import { flightTicketStyles as styles } from "./FlightTicketScreen.styles";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

type PickerOption = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
};

type PickerState = {
  title: string;
  selectedValue: string;
  options: PickerOption[];
  onSelect: (value: string) => void;
} | null;

type FlightTicketScreenProps = {
  onClose: () => void;
};

const BOOK_PLANE_VECTOR = require("../../../../../assets/images/book-plane-vector.png");

const IDR_FORMATTER = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const sanitizeText = (value?: string | number | null, fallback = "-") => {
  const text = String(value ?? "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return text || fallback;
};

const formatCurrency = (value: number) => IDR_FORMATTER.format(Math.max(0, value || 0));

const formatTimer = (totalSeconds: number) => {
  const safeTotal = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeTotal / 3600);
  const minutes = Math.floor((safeTotal % 3600) / 60);
  const seconds = safeTotal % 60;

  return [hours, minutes, seconds]
    .map((item) => String(item).padStart(2, "0"))
    .join(" : ");
};

const formatDuration = (minutes: number) => `${Math.max(1, minutes)} menit`;

const getAirport = (code: string) => flightTicketService.getAirportByCode(code);

const getAirportLabel = (code: string) => getAirport(code)?.label || "Pilih bandara";

const getAirportCity = (code: string) => getAirport(code)?.city || sanitizeText(code);

const getDateOption = (value: string) =>
  FLIGHT_DATE_OPTIONS.find((item) => item.value === value) || null;

const getDateLabel = (value: string, fallback = "Tanggal") =>
  getDateOption(value)?.label || fallback;

const AVAILABLE_DATE_VALUES = new Set(FLIGHT_DATE_OPTIONS.map((item) => item.value));

const VALID_TRIP_TYPES = new Set<TripType>(["oneWay", "roundTrip"]);
const isValidTripType = (value: string): value is TripType =>
  VALID_TRIP_TYPES.has(value as TripType);

const isValidAirportCode = (value: string) => /^[A-Z0-9]{2,8}$/.test(String(value || "").toUpperCase());

const isAvailableDateValue = (value: string) => AVAILABLE_DATE_VALUES.has(String(value || ""));

const getDateShortLabel = (value: string, fallback = "Tanggal") =>
  getDateOption(value)?.shortLabel || fallback;

const getCabinClassOption = (value: CabinClass) =>
  CABIN_CLASS_OPTIONS.find((item) => item.id === value) || CABIN_CLASS_OPTIONS[0];

const getCabinClassLabel = (value: CabinClass) => getCabinClassOption(value).label;

const getPassengerTotal = (passengers: PassengerCounts) =>
  passengers.adult + passengers.child + passengers.infant;

const getPassengerSummary = (passengers: PassengerCounts, cabinClass: CabinClass) => {
  const total = getPassengerTotal(passengers);
  return `${total} Penumpang | ${getCabinClassLabel(cabinClass)}`;
};

const toAirportOptions = (items: AirportOption[]): PickerOption[] =>
  items.map((item) => ({
    value: item.code,
    label: item.label,
    description: item.name,
  }));

const toDateValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseDateValue = (value: string) => {
  const safeValue = isAvailableDateValue(value) ? value : FLIGHT_DATE_OPTIONS[0]?.value || value;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(safeValue || ""));
  if (!match) return new Date();
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

const getMonthTitle = (date: Date) =>
  date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });

const getCalendarMatrix = (viewDate: Date) => {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const totalDays = new Date(year, month + 1, 0).getDate();
  const days: (Date | null)[] = [];

  for (let index = 0; index < firstDay.getDay(); index += 1) days.push(null);
  for (let day = 1; day <= totalDays; day += 1) days.push(new Date(year, month, day));
  while (days.length % 7 !== 0) days.push(null);

  return days;
};

function Header({
  title,
  subtitle,
  onBack,
  rightIcon,
  onRightPress,
}: {
  title: string;
  subtitle?: string;
  onBack: () => void;
  rightIcon?: IoniconName;
  onRightPress?: () => void;
}) {
  return (
    <View style={styles.headerRow}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Kembali"
        onPress={onBack}
        style={({ pressed }) => [
          styles.headerBackButton,
          pressed ? styles.fieldButtonPressed : null,
        ]}
      >
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </Pressable>

      <View style={styles.headerTitleBlock}>
        <Text numberOfLines={1} style={styles.headerTitle}>
          {sanitizeText(title)}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} style={styles.headerSubtitle}>
            {sanitizeText(subtitle)}
          </Text>
        ) : null}
      </View>

      {rightIcon && onRightPress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ubah jadwal"
          onPress={onRightPress}
          style={({ pressed }) => [
            styles.headerIconButton,
            pressed ? styles.fieldButtonPressed : null,
          ]}
        >
          <Ionicons name={rightIcon} size={21} color={colors.text} />
        </Pressable>
      ) : (
        <View style={{ width: 42 }} />
      )}
    </View>
  );
}

function PrimaryButton({
  label,
  icon,
  disabled = false,
  onPress,
  style,
}: {
  label: string;
  icon?: IoniconName;
  disabled?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryButton,
        disabled ? styles.primaryButtonDisabled : null,
        pressed && !disabled ? styles.fieldButtonPressed : null,
        style,
      ]}
    >
      {icon ? <Ionicons name={icon} size={18} color={colors.white} /> : null}
      <Text style={styles.primaryButtonText}>{sanitizeText(label)}</Text>
    </Pressable>
  );
}

function SecondaryButton({
  label,
  onPress,
  style,
}: {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.secondaryButton,
        pressed ? styles.fieldButtonPressed : null,
        style,
      ]}
    >
      <Text style={styles.secondaryButtonText}>{sanitizeText(label)}</Text>
    </Pressable>
  );
}

const SelectField = memo(function SelectField({
  label,
  value,
  icon,
  placeholder = "Pilih data",
  onPress,
  disabled = false,
}: {
  label: string;
  value?: string;
  icon: IoniconName;
  placeholder?: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const hasValue = Boolean(value && value !== placeholder);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${value || placeholder}`}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.fieldButton,
        disabled ? styles.fieldButtonDisabled : null,
        pressed && !disabled ? styles.fieldButtonPressed : null,
      ]}
    >
      <View style={styles.fieldIcon}>
        <Ionicons name={icon} size={17} color={colors.primaryDark} />
      </View>

      <View style={styles.fieldCopy}>
        <Text numberOfLines={1} style={styles.fieldLabel}>
          {sanitizeText(label)}
        </Text>
        <Text
          numberOfLines={1}
          style={[styles.fieldValue, !hasValue ? styles.fieldValueMuted : null]}
        >
          {sanitizeText(value, placeholder)}
        </Text>
      </View>

      <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
    </Pressable>
  );
});

function ErrorBox({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <View style={styles.errorBox} accessibilityRole="alert">
      <Text style={styles.errorText}>{sanitizeText(message)}</Text>
    </View>
  );
}

function TripTypeTabs({
  value,
  onChange,
}: {
  value: TripType;
  onChange: (value: TripType) => void;
}) {
  const tabs: { value: TripType; label: string; icon: IoniconName }[] = [
    { value: "oneWay", label: "Pergi saja", icon: "airplane-outline" },
    { value: "roundTrip", label: "Pulang pergi", icon: "swap-horizontal-outline" },
  ];

  return (
    <View style={styles.tripTabs}>
      {tabs.map((tab) => {
        const active = value === tab.value;
        return (
          <Pressable
            key={tab.value}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(tab.value)}
            style={({ pressed }) => [
              styles.tripTab,
              active ? styles.tripTabActive : null,
              pressed ? styles.fieldButtonPressed : null,
            ]}
          >
            <Ionicons name={tab.icon} size={16} color={active ? colors.white : colors.primaryDark} />
            <Text style={[styles.tripTabText, active ? styles.tripTabTextActive : null]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function SearchForm({
  form,
  compact = false,
  title = "Search Flight",
  subtitle,
  submitLabel = "Cari Penerbangan",
  errorMessage,
  isSubmitting = false,
  onChangeTripType,
  onSelectOrigin,
  onSelectDestination,
  onSelectDepartureDate,
  onSelectReturnDate,
  onOpenPassenger,
  onSubmit,
}: {
  form: FlightSearchForm;
  compact?: boolean;
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  errorMessage?: string;
  isSubmitting?: boolean;
  onChangeTripType: (value: TripType) => void;
  onSelectOrigin: () => void;
  onSelectDestination: () => void;
  onSelectDepartureDate: () => void;
  onSelectReturnDate: () => void;
  onOpenPassenger: () => void;
  onSubmit: () => void;
}) {
  const { width } = useWindowDimensions();
  const isRoundTrip = form.tripType === "roundTrip";
  const shouldStackDateFields = width < 430;

  return (
    <View style={[styles.formCard, compact ? styles.formCardCompact : null]}>
      {!compact ? (
        <View style={styles.searchFormHeader}>
          <Text style={styles.searchFormTitle}>{sanitizeText(title)}</Text>
          {subtitle ? (
            <Text style={styles.searchFormSubtitle}>{sanitizeText(subtitle)}</Text>
          ) : null}
        </View>
      ) : null}

      <TripTypeTabs value={form.tripType} onChange={onChangeTripType} />

      <View style={styles.fieldStack}>
        <SelectField
          label="Keberangkatan"
          value={getAirportLabel(form.originCode)}
          icon="airplane-outline"
          onPress={onSelectOrigin}
        />

        <SelectField
          label="Tujuan"
          value={getAirportLabel(form.destinationCode)}
          icon="location-outline"
          onPress={onSelectDestination}
        />

        <View
          style={[
            isRoundTrip ? styles.datePairRow : styles.datePairSingle,
            isRoundTrip && shouldStackDateFields ? styles.datePairRowStacked : null,
          ]}
        >
          <View style={styles.datePairItem}>
            <SelectField
              label="Tanggal Pergi"
              value={getDateShortLabel(form.departureDate)}
              icon="calendar-outline"
              onPress={onSelectDepartureDate}
            />
          </View>

          {isRoundTrip ? (
            <View style={styles.datePairItem}>
              <SelectField
                label="Tanggal Pulang"
                value={form.returnDate ? getDateShortLabel(form.returnDate) : "Pilih tanggal pulang"}
                icon="calendar-clear-outline"
                onPress={onSelectReturnDate}
              />
            </View>
          ) : null}
        </View>

        <SelectField
          label="Penumpang & Kelas"
          value={getPassengerSummary(form.passengers, form.cabinClass)}
          icon="people-outline"
          onPress={onOpenPassenger}
        />

        <PrimaryButton label={isSubmitting ? "Mencari..." : submitLabel} icon="search-outline" disabled={isSubmitting} onPress={onSubmit} />
      </View>

      <ErrorBox message={errorMessage} />
    </View>
  );
}

function OptionPickerModal({
  picker,
  onClose,
}: {
  picker: PickerState;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={Boolean(picker)}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.bottomSheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <View style={{ width: 38 }} />
            <Text style={styles.sheetTitle}>{sanitizeText(picker?.title, "Pilih data")}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Tutup pilihan"
              onPress={onClose}
              style={styles.sheetCloseButton}
            >
              <Ionicons name="close" size={21} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalList}>
            {(picker?.options || []).map((option) => {
              const selected = option.value === picker?.selectedValue;

              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="button"
                  accessibilityState={{ selected, disabled: option.disabled }}
                  disabled={option.disabled}
                  onPress={() => {
                    picker?.onSelect(option.value);
                    onClose();
                  }}
                  style={({ pressed }) => [
                    styles.optionRow,
                    selected ? styles.optionRowActive : null,
                    pressed ? styles.fieldButtonPressed : null,
                  ]}
                >
                  <View style={[styles.radioDot, !selected ? { borderColor: colors.borderStrong } : null]}>
                    {selected ? <View style={styles.radioDotInner} /> : null}
                  </View>

                  <View style={styles.optionText}>
                    <Text style={styles.optionRowTitle}>{sanitizeText(option.label)}</Text>
                    {option.description ? (
                      <Text style={styles.optionRowDescription}>
                        {sanitizeText(option.description)}
                      </Text>
                    ) : null}
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function PassengerCounterRow({
  title,
  description,
  value,
  min = 0,
  max = 9,
  onChange,
}: {
  title: string;
  description: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (direction: 1 | -1) => void;
}) {
  const canDecrease = value > min;
  const canIncrease = value < max;

  return (
    <View style={styles.counterRow}>
      <View>
        <Text style={styles.counterTitle}>{sanitizeText(title)}</Text>
        <Text style={styles.counterDescription}>{sanitizeText(description)}</Text>
      </View>

      <View style={styles.counterControls}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Kurangi ${title}`}
          accessibilityState={{ disabled: !canDecrease }}
          disabled={!canDecrease}
          onPress={() => onChange(-1)}
          style={[styles.counterButton, !canDecrease ? styles.counterButtonDisabled : null]}
        >
          <Ionicons name="remove" size={18} color={colors.text} />
        </Pressable>

        <Text style={styles.counterValue}>{value}</Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Tambah ${title}`}
          accessibilityState={{ disabled: !canIncrease }}
          disabled={!canIncrease}
          onPress={() => onChange(1)}
          style={[styles.counterButton, !canIncrease ? styles.counterButtonDisabled : null]}
        >
          <Ionicons name="add" size={18} color={colors.text} />
        </Pressable>
      </View>
    </View>
  );
}

function PassengerSheet({
  visible,
  cabinClass,
  passengers,
  onApply,
  onClose,
}: {
  visible: boolean;
  cabinClass: CabinClass;
  passengers: PassengerCounts;
  onApply: (nextCabinClass: CabinClass, nextPassengers: PassengerCounts) => void;
  onClose: () => void;
}) {
  const [draftCabinClass, setDraftCabinClass] = useState<CabinClass>(cabinClass);
  const [draftPassengers, setDraftPassengers] = useState<PassengerCounts>(passengers);

  useEffect(() => {
    if (!visible) return;
    setDraftCabinClass(cabinClass);
    setDraftPassengers(passengers);
  }, [cabinClass, passengers, visible]);

  const changeDraftPassenger = useCallback((key: PassengerKey, direction: 1 | -1) => {
    setDraftPassengers((currentPassengers) => {
      const nextPassengers = {
        ...currentPassengers,
        [key]: Math.max(0, currentPassengers[key] + direction),
      };

      if (key === "adult") {
        nextPassengers.adult = Math.max(1, nextPassengers.adult);
        nextPassengers.infant = Math.min(nextPassengers.infant, nextPassengers.adult);
      }

      if (key === "infant") {
        nextPassengers.infant = Math.min(nextPassengers.infant, nextPassengers.adult);
      }

      return normalizePassengers(nextPassengers);
    });
  }, []);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.bottomSheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <View style={{ width: 38 }} />
            <Text style={styles.sheetTitle}>Kelas dan Penumpang</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Tutup pilihan penumpang"
              onPress={onClose}
              style={styles.sheetCloseButton}
            >
              <Ionicons name="close" size={21} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.cabinGrid}>
              {CABIN_CLASS_OPTIONS.map((option: CabinClassOption) => {
                const selected = option.id === draftCabinClass;

                return (
                  <Pressable
                    key={option.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => setDraftCabinClass(option.id)}
                    style={({ pressed }) => [
                      styles.cabinChip,
                      selected ? styles.cabinChipActive : null,
                      pressed ? styles.fieldButtonPressed : null,
                    ]}
                  >
                    <Text style={styles.cabinChipTitle}>{option.label}</Text>
                    <Text style={styles.cabinChipDescription}>{option.description}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={{ marginTop: 14 }}>
              <PassengerCounterRow
                title="Dewasa"
                description=">11 Tahun"
                value={draftPassengers.adult}
                min={1}
                max={9}
                onChange={(direction) => changeDraftPassenger("adult", direction)}
              />
              <PassengerCounterRow
                title="Anak"
                description="2-11 Tahun"
                value={draftPassengers.child}
                min={0}
                max={8}
                onChange={(direction) => changeDraftPassenger("child", direction)}
              />
              <PassengerCounterRow
                title="Bayi"
                description="<2 Tahun"
                value={draftPassengers.infant}
                min={0}
                max={draftPassengers.adult}
                onChange={(direction) => changeDraftPassenger("infant", direction)}
              />
            </View>
          </ScrollView>

          <View style={styles.sheetActions}>
            <View style={styles.sheetActionItem}>
              <SecondaryButton label="Batal" onPress={onClose} />
            </View>
            <View style={styles.sheetActionItem}>
              <PrimaryButton
                label="Lanjutkan"
                onPress={() => {
                  onApply(draftCabinClass, draftPassengers);
                  onClose();
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function SearchScreen({
  topInset = 0,
  form,
  errorMessage,
  isSubmitting,
  onBack,
  onChangeTripType,
  onSelectOrigin,
  onSelectDestination,
  onSelectDepartureDate,
  onSelectReturnDate,
  onOpenPassenger,
  onSubmit,
}: {
  topInset?: number;
  form: FlightSearchForm;
  errorMessage?: string;
  isSubmitting?: boolean;
  onBack: () => void;
  onChangeTripType: (value: TripType) => void;
  onSelectOrigin: () => void;
  onSelectDestination: () => void;
  onSelectDepartureDate: () => void;
  onSelectReturnDate: () => void;
  onOpenPassenger: () => void;
  onSubmit: () => void;
}) {
  const { width } = useWindowDimensions();
  const heroPaddingTop = Math.max(topInset, 10) + 10;
  const heroHeight = Math.max(220, Math.min(300, Math.round(width * 0.62)));

  return (
    <ScrollView
      style={styles.searchScroll}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.searchScrollContent}
    >
      <View style={[styles.searchHeroFrame, { height: heroHeight }]}>
        <Image
          source={BOOK_PLANE_VECTOR}
          resizeMode="contain"
          style={styles.searchHeroImageSource}
        />

        <View pointerEvents="none" style={styles.searchHeroShade} />

        <View style={[styles.searchHeroContent, { paddingTop: heroPaddingTop }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Kembali"
            hitSlop={10}
            onPress={onBack}
            style={({ pressed }) => [
              styles.searchBackButton,
              pressed ? styles.fieldButtonPressed : null,
            ]}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
        </View>
      </View>

      <View style={styles.searchFormWrap}>
        <SearchForm
          title="Search Flight"
          submitLabel="Cari tiket"
          form={form}
          errorMessage={errorMessage}
          isSubmitting={isSubmitting}
          onChangeTripType={onChangeTripType}
          onSelectOrigin={onSelectOrigin}
          onSelectDestination={onSelectDestination}
          onSelectDepartureDate={onSelectDepartureDate}
          onSelectReturnDate={onSelectReturnDate}
          onOpenPassenger={onOpenPassenger}
          onSubmit={onSubmit}
        />
      </View>
    </ScrollView>
  );
}

function DateTabs({
  selectedDate,
  results,
  onChange,
}: {
  selectedDate: string;
  results: FlightSchedule[];
  onChange: (date: string) => void;
}) {
  const lowestPriceByDate = useMemo(() => {
    const map = new Map<string, number>();

    FLIGHT_DATE_OPTIONS.forEach((dateOption) => {
      const prices = results
        .filter((schedule) => schedule.departureDate === dateOption.value)
        .map((schedule) => schedule.price);

      map.set(dateOption.value, prices.length > 0 ? Math.min(...prices) : 487000);
    });

    return map;
  }, [results]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.dateTabs}
      contentContainerStyle={styles.dateTabsContent}
    >
      {FLIGHT_DATE_OPTIONS.map((dateOption) => {
        const active = selectedDate === dateOption.value;

        return (
          <Pressable
            key={dateOption.value}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(dateOption.value)}
            style={({ pressed }) => [
              styles.dateChip,
              active ? styles.dateChipActive : null,
              pressed ? styles.fieldButtonPressed : null,
            ]}
          >
            <Text style={styles.dateChipText}>{dateOption.shortLabel}</Text>
            <Text style={styles.dateChipPrice}>
              {formatCurrency(lowestPriceByDate.get(dateOption.value) || 0)}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function FlightScheduleCard({
  schedule,
  onPress,
}: {
  schedule: FlightSchedule;
  onPress: (schedule: FlightSchedule) => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Pilih penerbangan ${schedule.airlineName} ${schedule.departureTime}`}
      onPress={() => onPress(schedule)}
      style={({ pressed }) => [styles.scheduleCard, pressed ? styles.schedulePressed : null]}
    >
      <View style={styles.scheduleInner}>
        <View style={styles.airlineLogo}>
          <Text style={styles.airlineLogoText}>{schedule.airlineCode}</Text>
        </View>

        <View style={styles.scheduleMain}>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{schedule.departureTime}</Text>
            <View style={styles.planeLine}>
              <View style={styles.line} />
              <Ionicons name="airplane" size={18} color={colors.text} />
              <View style={styles.line} />
            </View>
            <Text style={styles.timeText}>{schedule.arrivalTime}</Text>
          </View>

          <View style={styles.airportCodeRow}>
            <Text style={styles.airportCode}>{schedule.originCode}</Text>
            <Text style={styles.durationText}>{formatDuration(schedule.durationMinutes)}</Text>
            <Text style={styles.airportCode}>{schedule.destinationCode}</Text>
          </View>

          <View style={styles.badgeRow}>
            <View style={styles.smallBadge}>
              <Text style={styles.smallBadgeText}>{schedule.airlineName}</Text>
            </View>
            <View style={styles.smallBadge}>
              <Text style={styles.smallBadgeText}>Bagasi check-in {schedule.baggageCheckedKg}Kg</Text>
            </View>
            {typeof schedule.quota === "number" && schedule.quota > 0 ? (
              <View style={styles.smallBadge}>
                <Text style={styles.smallBadgeText}>Sisa {schedule.quota} kursi</Text>
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.priceColumn}>
          {schedule.originalPrice > schedule.price ? (
            <Text style={styles.originalPrice}>{formatCurrency(schedule.originalPrice)}</Text>
          ) : null}
          <Text style={styles.priceText}>{formatCurrency(schedule.price)}</Text>
          <Text style={styles.priceCaption}>Harga dasar</Text>
        </View>
      </View>
    </Pressable>
  );
}

function ResultsScreen({
  form,
  results,
  isSearching = false,
  onEdit,
  onDateChange,
  onSelectSchedule,
}: {
  form: FlightSearchForm;
  results: FlightSchedule[];
  isSearching?: boolean;
  onEdit: () => void;
  onDateChange: (date: string) => void;
  onSelectSchedule: (schedule: FlightSchedule) => void;
}) {
  const routeTitle = `${getAirportCity(form.originCode)} (${form.originCode}) - ${getAirportCity(form.destinationCode)} (${form.destinationCode})`;

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <View style={styles.resultSummaryCard}>
        <Text numberOfLines={2} style={styles.routeTitle}>{routeTitle}</Text>
        <Text numberOfLines={1} style={styles.routeMeta}>
          {getDateLabel(form.departureDate)} | {getPassengerTotal(form.passengers)} org | {getCabinClassLabel(form.cabinClass)}
        </Text>
      </View>

      <DateTabs selectedDate={form.departureDate} results={results} onChange={onDateChange} />

      {isSearching ? (
        <View style={styles.emptyCard}>
          <Ionicons name="airplane-outline" size={30} color={colors.primaryDark} />
          <Text style={styles.emptyTitle}>Mencari jadwal...</Text>
          <Text style={styles.emptyDescription}>
            Tunggu sebentar, sistem sedang mengambil jadwal penerbangan dari server.
          </Text>
        </View>
      ) : results.length > 0 ? (
        <View style={styles.listStack}>
          {results.map((schedule) => (
            <FlightScheduleCard key={schedule.id} schedule={schedule} onPress={onSelectSchedule} />
          ))}
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <Ionicons name="airplane-outline" size={30} color={colors.primaryDark} />
          <Text style={styles.emptyTitle}>Jadwal belum tersedia</Text>
          <Text style={styles.emptyDescription}>
            Ubah rute, tanggal, atau kelas penerbangan untuk melihat pilihan lainnya.
          </Text>
          <PrimaryButton label="Ubah Jadwal" icon="create-outline" onPress={onEdit} style={{ marginTop: 14 }} />
        </View>
      )}
    </ScrollView>
  );
}

function FlightDetailScreen({
  schedule,
  onChoose,
}: {
  schedule: FlightSchedule;
  onChoose: () => void;
}) {
  const cabinLabel = getCabinClassLabel(schedule.cabinClass);

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <View style={styles.detailCard}>
        <Text style={styles.detailDate}>{getDateLabel(schedule.departureDate)} | {formatDuration(schedule.durationMinutes)}</Text>

        <View style={styles.timeline}>
          <View>
            <Text style={styles.timelineTime}>{schedule.departureTime}</Text>
            <View style={{ height: 34 }} />
            <Text style={styles.timelineTime}>{schedule.arrivalTime}</Text>
          </View>

          <View style={styles.timelineTrack}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineLine} />
            <View style={styles.timelineDot} />
          </View>

          <View style={styles.timelineCopy}>
            <View>
              <Text style={styles.timelineCity}>{getAirportLabel(schedule.originCode)}</Text>
              <View style={styles.timelineBadgeRow}>
                <View style={styles.smallBadge}><Text style={styles.smallBadgeText}>{schedule.airlineName}</Text></View>
                <View style={styles.smallBadge}><Text style={styles.smallBadgeText}>{cabinLabel}</Text></View>
                <View style={styles.smallBadge}><Text style={styles.smallBadgeText}>{schedule.flightNumber}</Text></View>
              </View>
            </View>
            <Text style={styles.timelineCity}>{getAirportLabel(schedule.destinationCode)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.fareCard}>
        <Text style={styles.fareClass}>{cabinLabel}</Text>
        {schedule.originalPrice > schedule.price ? (
          <Text style={styles.originalPrice}>{formatCurrency(schedule.originalPrice)}</Text>
        ) : null}
        <Text style={styles.farePrice}>{formatCurrency(schedule.price)}</Text>
        <Text style={styles.priceCaption}>Harga dasar</Text>

        <View style={styles.fareList}>
          <Text style={styles.fareListText}>Bagasi kabin {schedule.baggageCabinKg} Kg</Text>
          <Text style={styles.fareListText}>Bagasi check-in {schedule.baggageCheckedKg}Kg</Text>
          {schedule.refundable ? <Text style={styles.fareListText}>Bisa refund sesuai ketentuan</Text> : null}
          {schedule.reschedulable ? <Text style={styles.fareListText}>Bisa reschedule sesuai ketentuan</Text> : null}
          {(schedule.facilities || []).slice(0, 3).map((facility) => (
            <Text key={String(facility.id)} style={styles.fareListText}>{facility.name}</Text>
          ))}
        </View>

        <View style={styles.inlineButtonWrap}>
          <Pressable
            accessibilityRole="button"
            onPress={onChoose}
            style={({ pressed }) => [styles.miniButton, pressed ? styles.fieldButtonPressed : null]}
          >
            <Text style={styles.miniButtonText}>Pilih</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

function FlightSummaryCard({ schedule, form }: { schedule: FlightSchedule; form: FlightSearchForm }) {
  return (
    <View style={styles.resultSummaryCard}>
      <View style={styles.badgeRow}>
        <View style={styles.smallBadge}><Text style={styles.smallBadgeText}>Pergi</Text></View>
        {schedule.refundable ? <View style={styles.smallBadge}><Text style={styles.smallBadgeText}>Bisa refund</Text></View> : null}
        {schedule.reschedulable ? <View style={styles.smallBadge}><Text style={styles.smallBadgeText}>Bisa reschedule</Text></View> : null}
      </View>
      <Text style={[styles.routeTitle, { marginTop: 8 }]}>{getAirportCity(schedule.originCode)} - {getAirportCity(schedule.destinationCode)}</Text>
      <Text style={styles.routeMeta}>
        {getDateLabel(schedule.departureDate)} | {schedule.departureTime} - {schedule.arrivalTime} | {getCabinClassLabel(form.cabinClass)}
      </Text>
    </View>
  );
}

function BaggageOptionCard({
  option,
  selected,
  onPress,
}: {
  option: BaggageOption;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.optionCard,
        selected ? styles.optionCardSelected : null,
        pressed ? styles.fieldButtonPressed : null,
      ]}
    >
      <View style={[styles.radioDot, !selected ? { borderColor: colors.borderStrong } : null]}>
        {selected ? <View style={styles.radioDotInner} /> : null}
      </View>
      <Text style={styles.optionTitle}>{option.label}</Text>
      <Text style={styles.optionPrice}>{formatCurrency(option.price)}</Text>
    </Pressable>
  );
}

function ProtectionCard({
  option,
  selected,
  onPress,
}: {
  option: ProtectionOption;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.optionCard,
        selected ? styles.optionCardSelected : null,
        pressed ? styles.fieldButtonPressed : null,
      ]}
    >
      <View style={styles.optionText}>
        <Text style={styles.optionTitle}>{option.title}</Text>
        <Text style={styles.optionDescription}>{option.description}</Text>
      </View>
      <View style={{ alignItems: "flex-end", gap: 8 }}>
        <Text style={styles.optionPrice}>{formatCurrency(option.price)}</Text>
        <View style={styles.miniButton}>
          <Text style={styles.miniButtonText}>{selected ? "Dipilih" : "Pilih"}</Text>
        </View>
      </View>
    </Pressable>
  );
}

function PassengerInfoScreen({
  schedule,
  form,
  selectedBaggageId,
  selectedProtectionIds,
  totalPrice,
  onSelectBaggage,
  onToggleProtection,
  onContinue,
}: {
  schedule: FlightSchedule;
  form: FlightSearchForm;
  selectedBaggageId: string;
  selectedProtectionIds: string[];
  totalPrice: number;
  onSelectBaggage: (id: string) => void;
  onToggleProtection: (id: string) => void;
  onContinue: () => void;
}) {
  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <FlightSummaryCard schedule={schedule} form={form} />

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderTitle}>Informasi Lengkap</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.passengerCard}>
              <View style={styles.radioDot}><View style={styles.radioDotInner} /></View>
              <Text style={styles.passengerName}>Cahyo Nugroho</Text>
              <View style={styles.miniButton}><Text style={styles.miniButtonText}>Edit</Text></View>
            </View>
            <Text style={styles.routeMeta}>Lihat semua nama atau tambah baru⌄</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderTitle}>Kontak</Text>
          </View>
          <View style={styles.sectionContent}>
            <Text style={styles.routeMeta}>E-tiket akan dikirim melalui email di bawah ini</Text>
            <Text style={styles.contactName}>Cahyo Nugroho</Text>
            <Text style={styles.contactMeta}>cahyonugroho@gmail.com | +6287907897600</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderTitle}>Fasilitas Ekstra</Text>
          </View>
          <View style={styles.sectionContent}>
            <Text style={styles.routeMeta}>Yakin bagasi 10Kg cukup untuk semua barang bawaan kamu?</Text>
            {BAGGAGE_OPTIONS.map((option) => (
              <BaggageOptionCard
                key={option.id}
                option={option}
                selected={selectedBaggageId === option.id}
                onPress={() => onSelectBaggage(option.id)}
              />
            ))}
          </View>
        </View>

        {PROTECTION_OPTIONS.map((option) => (
          <View key={option.id} style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderTitle}>{option.title}</Text>
            </View>
            <View style={styles.sectionContent}>
              <ProtectionCard
                option={option}
                selected={selectedProtectionIds.includes(option.id)}
                onPress={() => onToggleProtection(option.id)}
              />
            </View>
          </View>
        ))}
      </ScrollView>

      <BottomPriceBar
        caption="Hore kamu berhasil mengamankan harga!"
        originalPrice={schedule.originalPrice}
        price={totalPrice}
        buttonLabel="Lanjut bayar"
        onPress={onContinue}
      />
    </>
  );
}

function PaymentMethodCard({
  method,
  selected,
  onPress,
}: {
  method: PaymentMethod;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.optionCard,
        selected ? styles.optionCardSelected : null,
        pressed ? styles.fieldButtonPressed : null,
      ]}
    >
      <View style={styles.airlineLogo}>
        <Ionicons name={method.icon as IoniconName} size={22} color={colors.primaryDark} />
      </View>
      <View style={styles.optionText}>
        <Text style={styles.optionTitle}>{method.label}</Text>
        <Text style={styles.optionDescription}>{method.description}</Text>
      </View>
      <View style={[styles.radioDot, !selected ? { borderColor: colors.borderStrong } : null]}>
        {selected ? <View style={styles.radioDotInner} /> : null}
      </View>
    </Pressable>
  );
}

function PaymentScreen({
  order,
  remainingSeconds,
  selectedPaymentMethodId,
  onSelectPaymentMethod,
  onPayNow,
}: {
  order: FlightOrder;
  remainingSeconds: number;
  selectedPaymentMethodId: string;
  onSelectPaymentMethod: (id: string) => void;
  onPayNow: () => void;
}) {
  const schedule = order.schedule;

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.resultSummaryCard}>
          <View style={styles.paymentCountdown}>
            <Text style={styles.routeMeta}>Selesaikan sebelum</Text>
            <View style={styles.timerPill}>
              <Text style={styles.timerText}>{formatTimer(remainingSeconds)}</Text>
            </View>
          </View>
          <Text style={[styles.routeTitle, { marginTop: 12 }]}>
            {getAirportCity(schedule.originCode)} - {getAirportCity(schedule.destinationCode)}
          </Text>
          <Text style={styles.routeMeta}>
            {getDateLabel(schedule.departureDate)} | {schedule.departureTime} - {schedule.arrivalTime} | {getCabinClassLabel(schedule.cabinClass)}
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderTitle}>Metode Pembayaran</Text>
          </View>
          <View style={styles.sectionContent}>
            {PAYMENT_METHODS.map((method) => (
              <PaymentMethodCard
                key={method.id}
                method={method}
                selected={selectedPaymentMethodId === method.id}
                onPress={() => onSelectPaymentMethod(method.id)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <BottomPriceBar
        caption="Harga sudah termasuk pajak"
        price={order.totalPrice}
        buttonLabel="Bayar Sekarang"
        onPress={onPayNow}
      />
    </>
  );
}

function StatusScreen({ order, onHome }: { order: FlightOrder; onHome: () => void }) {
  const selectedPayment = PAYMENT_METHODS.find((item) => item.id === order.paymentMethodId);

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <View style={styles.statusHero}>
        <View style={styles.statusIcon}>
          <Ionicons name="checkmark-circle" size={42} color={colors.primaryDark} />
        </View>
        <Text style={styles.statusTitle}>Pembayaran Berhasil</Text>
        <Text style={styles.statusDescription}>
          Status pembayaran sudah berhasil dan pesanan tiket kamu telah dikonfirmasi.
        </Text>
      </View>

      <View style={styles.statusInfoCard}>
        <StatusRow label="Order ID" value={order.id} />
        <StatusRow label="Status Pembayaran" value="Berhasil" />
        <StatusRow label="Status Pemesanan" value="Terkonfirmasi" />
        <StatusRow label="Rute" value={`${getAirportCity(order.schedule.originCode)} - ${getAirportCity(order.schedule.destinationCode)}`} />
        <StatusRow label="Metode" value={selectedPayment?.label || "Pembayaran"} />
        <StatusRow label="Total" value={formatCurrency(order.totalPrice)} />
      </View>

      <PrimaryButton label="Kembali ke Home" icon="home-outline" onPress={onHome} style={{ marginTop: 18 }} />
    </ScrollView>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statusRow}>
      <Text style={styles.statusLabel}>{sanitizeText(label)}</Text>
      <Text numberOfLines={2} style={styles.statusValue}>{sanitizeText(value)}</Text>
    </View>
  );
}

function BottomPriceBar({
  caption,
  originalPrice,
  price,
  buttonLabel,
  onPress,
}: {
  caption: string;
  originalPrice?: number;
  price: number;
  buttonLabel: string;
  onPress: () => void;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 14) }]}>
      <View style={styles.bottomBarContent}>
        <View style={{ flex: 1 }}>
          <Text style={styles.bottomPriceCaption}>{sanitizeText(caption)}</Text>
          {originalPrice ? <Text style={styles.bottomOriginalPrice}>{formatCurrency(originalPrice)}</Text> : null}
          <Text style={styles.bottomPrice}>{formatCurrency(price)}</Text>
          <Text style={styles.bottomPriceCaption}>Total pembayaran</Text>
        </View>

        <PrimaryButton label={buttonLabel} onPress={onPress} style={styles.bottomButton} />
      </View>
    </View>
  );
}

function EditScheduleModal({
  visible,
  form,
  errorMessage,
  isSubmitting = false,
  onClose,
  onChangeTripType,
  onSelectOrigin,
  onSelectDestination,
  onSelectDepartureDate,
  onSelectReturnDate,
  onOpenPassenger,
  onSubmit,
}: {
  visible: boolean;
  form: FlightSearchForm;
  errorMessage?: string;
  isSubmitting?: boolean;
  onClose: () => void;
  onChangeTripType: (value: TripType) => void;
  onSelectOrigin: () => void;
  onSelectDestination: () => void;
  onSelectDepartureDate: () => void;
  onSelectReturnDate: () => void;
  onOpenPassenger: () => void;
  onSubmit: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={[styles.modalBackdrop, styles.modalBackdropCenter]}>
        <View style={styles.dialogCard}>
          <View style={styles.sheetHeader}>
            <View style={{ width: 38 }} />
            <Text style={styles.sheetTitle}>Ubah Jadwal Penerbangan</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Tutup ubah jadwal"
              onPress={onClose}
              style={styles.sheetCloseButton}
            >
              <Ionicons name="close" size={21} color={colors.text} />
            </Pressable>
          </View>

          <SearchForm
            compact
            form={form}
            errorMessage={errorMessage}
            isSubmitting={isSubmitting}
            onChangeTripType={onChangeTripType}
            onSelectOrigin={onSelectOrigin}
            onSelectDestination={onSelectDestination}
            onSelectDepartureDate={onSelectDepartureDate}
            onSelectReturnDate={onSelectReturnDate}
            onOpenPassenger={onOpenPassenger}
            onSubmit={onSubmit}
          />
        </View>
      </View>
    </Modal>
  );
}

function CalendarDatePickerModal({
  visible,
  title,
  selectedValue,
  allowClear = false,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  selectedValue: string;
  allowClear?: boolean;
  onSelect: (value: string) => void;
  onClose: () => void;
}) {
  const { height } = useWindowDimensions();
  const calendarMaxHeight = Math.max(420, Math.min(height - 36, 650));
  const [viewDate, setViewDate] = useState(() => parseDateValue(selectedValue));

  useEffect(() => {
    if (visible) setViewDate(parseDateValue(selectedValue));
  }, [selectedValue, visible]);

  const days = useMemo(() => getCalendarMatrix(viewDate), [viewDate]);
  const selectedDateValue = selectedValue || "";
  const firstAvailableDateValue = FLIGHT_DATE_OPTIONS[0]?.value || "";

  const moveMonth = useCallback((direction: -1 | 1) => {
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + direction, 1));
  }, []);

  const handleSelect = useCallback((dateValue: string) => {
    if (!isAvailableDateValue(dateValue)) return;
    onSelect(dateValue);
    onClose();
  }, [onClose, onSelect]);

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <View style={[styles.modalBackdrop, styles.modalBackdropCenter]}>
        <View style={[styles.calendarCard, { maxHeight: calendarMaxHeight }]}>
          <View style={styles.sheetHeader}>
            <View style={{ width: 38 }} />
            <Text style={styles.sheetTitle}>{sanitizeText(title, "Pilih tanggal")}</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Tutup date picker" onPress={onClose} style={styles.sheetCloseButton}>
              <Ionicons name="close" size={21} color={colors.text} />
            </Pressable>
          </View>

          <View style={styles.calendarHeader}>
            <Pressable accessibilityRole="button" onPress={() => moveMonth(-1)} style={styles.calendarNavButton}>
              <Ionicons name="chevron-back" size={20} color={colors.primaryDark} />
            </Pressable>
            <Text style={styles.calendarTitle}>{getMonthTitle(viewDate)}</Text>
            <Pressable accessibilityRole="button" onPress={() => moveMonth(1)} style={styles.calendarNavButton}>
              <Ionicons name="chevron-forward" size={20} color={colors.primaryDark} />
            </Pressable>
          </View>

          <View style={styles.calendarWeekRow}>
            {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
              <Text key={day} style={styles.calendarWeekText}>{day}</Text>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {days.map((date, index) => {
              const value = date ? toDateValue(date) : `empty-${index}`;
              const isSelectable = Boolean(date && isAvailableDateValue(value));
              const active = Boolean(date && value === selectedDateValue);

              return (
                <Pressable
                  key={value}
                  accessibilityRole={isSelectable ? "button" : undefined}
                  disabled={!isSelectable}
                  onPress={() => isSelectable && handleSelect(value)}
                  style={({ pressed }) => [
                    styles.calendarDay,
                    active ? styles.calendarDayActive : null,
                    pressed && isSelectable ? styles.fieldButtonPressed : null,
                    !isSelectable && date ? styles.fieldButtonDisabled : null,
                  ]}
                >
                  <Text style={[styles.calendarDayText, active ? styles.calendarDayTextActive : null, !isSelectable && date ? styles.fieldValueMuted : null]}>
                    {date ? date.getDate() : ""}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.calendarActions}>
            {allowClear ? (
              <Pressable accessibilityRole="button" onPress={() => { onSelect(""); onClose(); }} style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Tanpa tanggal</Text>
              </Pressable>
            ) : null}
            <Pressable accessibilityRole="button" onPress={() => handleSelect(firstAvailableDateValue)} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Pilih Tanggal Tersedia</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export function FlightTicketScreen({ onClose }: FlightTicketScreenProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const booking = useFlightTicketBooking();
  const allowNativeRouteLeaveRef = useRef(false);

  const [picker, setPicker] = useState<PickerState>(null);
  const [showPassengerSheet, setShowPassengerSheet] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [datePicker, setDatePicker] = useState<null | { field: "departureDate" | "returnDate"; title: string; allowClear?: boolean }>(null);

  useEffect(() => {
    const parent = navigation?.getParent?.();
    parent?.setOptions?.({ tabBarStyle: { display: "none" } });

    return () => {
      parent?.setOptions?.({ tabBarStyle: undefined });
    };
  }, [navigation]);

  const handleChangeTripType = useCallback((value: TripType) => {
    if (!isValidTripType(value)) return;

    booking.updateFormField("tripType", value);
    if (value === "oneWay") booking.updateFormField("returnDate", "");
  }, [booking]);

  const openOriginPicker = useCallback(() => {
    setPicker({
      title: "Pilih Keberangkatan",
      selectedValue: booking.form.originCode,
      options: toAirportOptions(booking.airports).map((option) => ({
        ...option,
        disabled: option.value === booking.form.destinationCode,
      })),
      onSelect: (value) => {
        if (isValidAirportCode(value) && value !== booking.form.destinationCode) {
          booking.updateFormField("originCode", value);
        }
      },
    });
  }, [booking]);

  const openDestinationPicker = useCallback(() => {
    setPicker({
      title: "Pilih Tujuan",
      selectedValue: booking.form.destinationCode,
      options: toAirportOptions(booking.airports).map((option) => ({
        ...option,
        disabled: option.value === booking.form.originCode,
      })),
      onSelect: (value) => {
        if (isValidAirportCode(value) && value !== booking.form.originCode) {
          booking.updateFormField("destinationCode", value);
        }
      },
    });
  }, [booking]);

  const openDepartureDatePicker = useCallback(() => {
    setDatePicker({ field: "departureDate", title: "Pilih Tanggal Pergi" });
  }, []);

  const openReturnDatePicker = useCallback(() => {
    setDatePicker({ field: "returnDate", title: "Pilih Tanggal Pulang", allowClear: true });
  }, []);

  const runWithNativeRouteLeave = useCallback((callback: () => void) => {
    allowNativeRouteLeaveRef.current = true;

    try {
      callback();
    } finally {
      setTimeout(() => {
        allowNativeRouteLeaveRef.current = false;
      }, 500);
    }
  }, []);

  const handleCloseScreen = useCallback(() => {
    runWithNativeRouteLeave(onClose);
  }, [onClose, runWithNativeRouteLeave]);

  const handleBack = useCallback(() => {
    if (datePicker) {
      setDatePicker(null);
      return;
    }

    if (picker) {
      setPicker(null);
      return;
    }

    if (showPassengerSheet) {
      setShowPassengerSheet(false);
      return;
    }

    if (showEditModal) {
      setShowEditModal(false);
      return;
    }

    if (booking.step === "search") {
      handleCloseScreen();
      return;
    }

    booking.goBack();
  }, [
    booking,
    datePicker,
    handleCloseScreen,
    picker,
    showEditModal,
    showPassengerSheet,
  ]);

  useEffect(() => {
    const unsubscribe = navigation?.addListener?.("beforeRemove", (event: any) => {
      if (allowNativeRouteLeaveRef.current) return;

      const actionType = String(event?.data?.action?.type || "");
      const isBackAction =
        actionType === "GO_BACK" ||
        actionType === "POP" ||
        actionType === "POP_TO_TOP";

      if (!isBackAction) return;

      event.preventDefault();
      handleBack();
    });

    return typeof unsubscribe === "function" ? unsubscribe : undefined;
  }, [handleBack, navigation]);

  const handleSearchSubmit = useCallback(async () => {
    const isSuccess = await booking.submitSearch();
    if (isSuccess) setShowEditModal(false);
  }, [booking]);

  const handleGoHome = useCallback(() => {
    booking.resetFlow();
    handleCloseScreen();
  }, [booking, handleCloseScreen]);

  const headerConfig = useMemo(() => {
    if (booking.step === "results") {
      return {
        title: `${getAirportCity(booking.form.originCode)} - ${getAirportCity(booking.form.destinationCode)}`,
        subtitle: `${getDateShortLabel(booking.form.departureDate)} | ${getPassengerTotal(booking.form.passengers)} org | ${getCabinClassLabel(booking.form.cabinClass)}`,
        rightIcon: "create-outline" as IoniconName,
        onRightPress: () => setShowEditModal(true),
      };
    }

    if (booking.step === "detail" && booking.selectedSchedule) {
      return {
        title: `${getAirportCity(booking.selectedSchedule.originCode)} - ${getAirportCity(booking.selectedSchedule.destinationCode)}`,
        subtitle: getDateLabel(booking.selectedSchedule.departureDate),
      };
    }

    if (booking.step === "passenger") {
      return {
        title: "Informasi Lengkap",
        subtitle: "Lengkapi pesanan kamu sekarang, yuk!",
      };
    }

    if (booking.step === "payment") {
      return {
        title: "Pembayaran",
        subtitle: booking.order ? `Order ID: ${booking.order.id}` : "Selesaikan pembayaran",
      };
    }

    if (booking.step === "status") {
      return {
        title: "Status Pesanan",
        subtitle: "Pembayaran dan pemesanan tiket",
      };
    }

    return {
      title: "Pesan Tiket Pesawat",
      subtitle: "Cari jadwal terbaik untuk perjalananmu.",
    };
  }, [booking.form, booking.order, booking.selectedSchedule, booking.step]);

  return (
    <Screen edges={["left", "right"]} statusBarStyle="dark-content">
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} translucent={false} />

      <View style={styles.screen}>
        {booking.step !== "search" ? (
          <View style={[styles.header, { paddingTop: Math.max(insets.top, 10) + 10 }]}>
            <Header
              title={headerConfig.title}
              subtitle={headerConfig.subtitle}
              onBack={handleBack}
              rightIcon={headerConfig.rightIcon}
              onRightPress={headerConfig.onRightPress}
            />
          </View>
        ) : null}

        {booking.step === "search" ? (
          <SearchScreen
            topInset={insets.top}
            form={booking.form}
            errorMessage={booking.errorMessage}
            isSubmitting={booking.isSearching}
            onBack={handleBack}
            onChangeTripType={handleChangeTripType}
            onSelectOrigin={openOriginPicker}
            onSelectDestination={openDestinationPicker}
            onSelectDepartureDate={openDepartureDatePicker}
            onSelectReturnDate={openReturnDatePicker}
            onOpenPassenger={() => setShowPassengerSheet(true)}
            onSubmit={handleSearchSubmit}
          />
        ) : null}

        {booking.step === "results" ? (
          <ResultsScreen
            form={booking.form}
            results={booking.results}
            isSearching={booking.isSearching}
            onEdit={() => setShowEditModal(true)}
            onDateChange={(date) => { void booking.submitSearch({ departureDate: date }); }}
            onSelectSchedule={booking.selectSchedule}
          />
        ) : null}

        {booking.step === "detail" && booking.selectedSchedule ? (
          <FlightDetailScreen schedule={booking.selectedSchedule} onChoose={booking.continueToPassenger} />
        ) : null}

        {booking.step === "passenger" && booking.selectedSchedule ? (
          <PassengerInfoScreen
            schedule={booking.selectedSchedule}
            form={booking.form}
            selectedBaggageId={booking.selectedBaggageId}
            selectedProtectionIds={booking.selectedProtectionIds}
            totalPrice={booking.totalPrice}
            onSelectBaggage={booking.selectBaggage}
            onToggleProtection={booking.toggleProtection}
            onContinue={booking.continueToPayment}
          />
        ) : null}

        {booking.step === "payment" && booking.order ? (
          <PaymentScreen
            order={booking.order}
            remainingSeconds={booking.paymentRemainingSeconds}
            selectedPaymentMethodId={booking.selectedPaymentMethodId}
            onSelectPaymentMethod={booking.selectPaymentMethod}
            onPayNow={booking.payNow}
          />
        ) : null}

        {booking.step === "status" && booking.order ? (
          <StatusScreen order={booking.order} onHome={handleGoHome} />
        ) : null}

        <OptionPickerModal picker={picker} onClose={() => setPicker(null)} />

        <CalendarDatePickerModal
          visible={Boolean(datePicker)}
          title={datePicker?.title || "Pilih tanggal"}
          selectedValue={datePicker?.field === "returnDate" ? booking.form.returnDate : booking.form.departureDate}
          allowClear={Boolean(datePicker?.allowClear)}
          onSelect={(value) => {
            if (!datePicker?.field) return;

            if (value === "" && datePicker.field === "returnDate") {
              booking.updateFormField(datePicker.field, "");
              return;
            }

            if (isAvailableDateValue(value)) {
              booking.updateFormField(datePicker.field, value);
            }
          }}
          onClose={() => setDatePicker(null)}
        />

        <PassengerSheet
          visible={showPassengerSheet}
          cabinClass={booking.form.cabinClass}
          passengers={booking.form.passengers}
          onApply={booking.applyPassengerSelection}
          onClose={() => setShowPassengerSheet(false)}
        />

        <EditScheduleModal
          visible={showEditModal}
          form={booking.form}
          errorMessage={booking.errorMessage}
          isSubmitting={booking.isSearching}
          onClose={() => setShowEditModal(false)}
          onChangeTripType={handleChangeTripType}
          onSelectOrigin={openOriginPicker}
          onSelectDestination={openDestinationPicker}
          onSelectDepartureDate={openDepartureDatePicker}
          onSelectReturnDate={openReturnDatePicker}
          onOpenPassenger={() => setShowPassengerSheet(true)}
          onSubmit={handleSearchSubmit}
        />
      </View>
    </Screen>
  );
}
