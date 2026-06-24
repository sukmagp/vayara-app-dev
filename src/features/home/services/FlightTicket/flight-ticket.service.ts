import type { ApiResponse } from "@/services/api/api.types";
import { apiClient } from "@/services/api/apiClient";
import type {
  AirportOption,
  BaggageOption,
  CabinClass,
  FlightFacility,
  FlightOrder,
  FlightSchedule,
  FlightSearchForm,
  PassengerCounts,
} from "../../types/FlightTicket/flight-ticket.types";
import {
  AIRPORT_OPTIONS,
  BAGGAGE_OPTIONS,
  CABIN_CLASS_OPTIONS,
  PAYMENT_METHODS,
  PROTECTION_OPTIONS,
} from "./flight-ticket.mock";

const MAX_PASSENGER_TOTAL = 9;
const AIRPORT_TYPE = "bandara";

export const DEFAULT_PASSENGERS: PassengerCounts = {
  adult: 1,
  child: 0,
  infant: 0,
};

export const DEFAULT_FLIGHT_SEARCH_FORM: FlightSearchForm = {
  tripType: "oneWay",
  originCode: "CGK",
  destinationCode: "KNO",
  departureDate: "2026-06-21",
  returnDate: "",
  cabinClass: "business",
  passengers: DEFAULT_PASSENGERS,
};

type ApiHub = {
  id?: number | string;
  tipe_hub?: string | null;
  code_hub?: string | null;
  name_hub?: string | null;
};

type ApiFlightFacility = {
  id?: number | string;
  nama_fasilitas?: string | null;
  kategori_fasilitas?: string | null;
  keterangan?: string | null;
  keterangan_ekstra?: string | null;
};

type ApiFlightSchedule = {
  id?: number | string;
  sector_id?: number | string;
  nama_sector?: string | null;
  tipe_sector?: string | null;
  hub_asal?: number | string | null;
  hub_tujuan?: number | string | null;
  tipe_hub?: string | null;
  name_hub_asal?: string | null;
  name_hub_tujuan?: string | null;
  code_hub_asal?: string | null;
  code_hub_tujuan?: string | null;
  waktu_keberangkatan?: string | null;
  waktu_kedatangan?: string | null;
  harga_dasar?: number | string | null;
  kuota?: number | string | null;
  is_active?: boolean | number | string | null;
  fasilitas?: ApiFlightFacility[] | null;
};

type ApiScheduleSearchData = {
  jadwal_keberangkatan?: ApiFlightSchedule[] | null;
  jadwal_pulang?: ApiFlightSchedule[] | null;
};

type ApiScheduleSearchResponse = ApiResponse<ApiScheduleSearchData>;
type ApiAirportResponse = ApiResponse<ApiHub[]>;

let airportCache: AirportOption[] = [...AIRPORT_OPTIONS];

const normalizeCode = (value: string | number | null | undefined) =>
  String(value || "")
    .replace(/[^a-z0-9]/gi, "")
    .toUpperCase()
    .slice(0, 8);

const sanitizeText = (value: string | number | null | undefined, fallback = "") => {
  const text = String(value ?? "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return text || fallback;
};

const safeNumber = (value: number | string | null | undefined, fallback = 0) => {
  const numberValue = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(numberValue)) return fallback;
  return Math.max(0, Math.floor(Number(numberValue)));
};

const safePrice = (value: number | string | null | undefined) => {
  const numberValue = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(numberValue)) return 0;
  return Math.max(0, Math.round(Number(numberValue)));
};

const sumPassengers = (passengers: PassengerCounts) =>
  passengers.adult + passengers.child + passengers.infant;

const isPlainDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

const toDateOnly = (value: string | null | undefined) => {
  const text = sanitizeText(value);
  if (isPlainDate(text)) return text;
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(text);
  return match?.[1] || "";
};

const toClock = (value: string | null | undefined) => {
  const text = sanitizeText(value);
  const match = /T(\d{2}:\d{2})/.exec(text) || /\b(\d{2}:\d{2})\b/.exec(text);
  return match?.[1] || "--:--";
};

const toDateMs = (value: string | null | undefined) => {
  const date = new Date(String(value || ""));
  const time = date.getTime();
  return Number.isFinite(time) ? time : 0;
};

const calculateDurationMinutes = (
  departure: string | null | undefined,
  arrival: string | null | undefined,
) => {
  const departureMs = toDateMs(departure);
  const arrivalMs = toDateMs(arrival);
  const diffMinutes = Math.round((arrivalMs - departureMs) / 60000);

  return diffMinutes > 0 ? diffMinutes : 60;
};

const cityFallbackMap: Record<string, string> = {
  CGK: "Jakarta",
  HLP: "Jakarta",
  SUB: "Surabaya",
  DPS: "Bali",
  KNO: "Medan",
  MES: "Medan",
  UPG: "Makassar",
  BPN: "Balikpapan",
  TKG: "Lampung",
  PLM: "Palembang",
  DJB: "Jambi",
  PNK: "Pontianak",
  BDJ: "Banjarmasin",
  SRG: "Semarang",
  SOC: "Solo",
  JOG: "Yogyakarta",
  LOP: "Lombok",
  LBJ: "Labuan Bajo",
  MDC: "Manado",
  AMQ: "Ambon",
  SOQ: "Sorong",
  DJJ: "Jayapura",
};

const inferCity = (code: string, name: string) => {
  const safeCode = normalizeCode(code);
  if (cityFallbackMap[safeCode]) return cityFallbackMap[safeCode];

  const cleaned = name
    .replace(/\b(International|Airport|Bandar Udara|Internasional|Sultan|Radin|Halim|Soekarno|Hatta)\b/gi, "")
    .replace(/[\-–—]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned.split(" ").slice(0, 2).join(" ") || safeCode || "Bandara";
};

const mapHubToAirport = (item: ApiHub): AirportOption | null => {
  const code = normalizeCode(item.code_hub);
  const name = sanitizeText(item.name_hub, code);

  if (!code || !name) return null;

  const city = inferCity(code, name);

  return {
    id: item.id,
    type: sanitizeText(item.tipe_hub, AIRPORT_TYPE).toLowerCase(),
    code,
    city,
    name,
    label: `${city} (${code})`,
  };
};

const dedupeAirports = (items: AirportOption[]) => {
  const map = new Map<string, AirportOption>();

  items.forEach((item) => {
    const code = normalizeCode(item.code);
    if (!code) return;
    map.set(code, { ...item, code });
  });

  return Array.from(map.values()).sort((a, b) => a.code.localeCompare(b.code));
};

const getAirportIdForApi = (airport: AirportOption | null, code: string) => {
  if (airport?.id !== undefined && airport.id !== null && String(airport.id).trim()) {
    return String(airport.id);
  }

  return normalizeCode(code);
};

const normalizeAirportList = (items?: AirportOption[]) => {
  const candidates = items && items.length > 0 ? items : airportCache;
  return candidates.length > 0 ? candidates : AIRPORT_OPTIONS;
};

const findAirportByCode = (code: string, items?: AirportOption[]) => {
  const safeCode = normalizeCode(code);
  return normalizeAirportList(items).find((airport) => airport.code === safeCode) || null;
};

const isKnownAirport = (code: string, items?: AirportOption[]) =>
  Boolean(findAirportByCode(code, items));

const isKnownCabinClass = (value: string): value is CabinClass =>
  CABIN_CLASS_OPTIONS.some((item) => item.id === value);

const normalizeCabinClass = (value: string | null | undefined): CabinClass => {
  const text = sanitizeText(value).toLowerCase();

  if (/first|utama|premium/.test(text)) return "first";
  if (/business|bisnis/.test(text)) return "business";
  return "economy";
};

const getAirlineName = (sectorName: string) => {
  const withoutRoute = sectorName.replace(/\([^)]*\)/g, "").trim();
  const withoutAircraft = withoutRoute
    .replace(/\b(Airbus|Boeing|ATR|A\d{3}|B\d{3}|Business|Bisnis|Economy|Ekonomi|First|Class)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  return withoutAircraft || sectorName || "Maskapai";
};

const getAirlineCode = (airlineName: string, fallbackId: string) => {
  const words = airlineName.replace(/[^a-z0-9 ]/gi, " ").trim().split(/\s+/).filter(Boolean);
  const code = words.length === 1
    ? words[0].slice(0, 2)
    : words.map((word) => word[0]).join("").slice(0, 2);

  return normalizeCode(code || fallbackId).slice(0, 3) || "VY";
};

const mapFacility = (facility: ApiFlightFacility): FlightFacility | null => {
  const name = sanitizeText(facility.nama_fasilitas);
  if (!name) return null;

  return {
    id: facility.id || name,
    name,
    category: sanitizeText(facility.kategori_fasilitas),
    description: sanitizeText(facility.keterangan),
    extraDescription: sanitizeText(facility.keterangan_ekstra),
  };
};

const mapApiSchedule = (item: ApiFlightSchedule): FlightSchedule | null => {
  const id = sanitizeText(item.id ?? item.sector_id);
  const originCode = normalizeCode(item.code_hub_asal);
  const destinationCode = normalizeCode(item.code_hub_tujuan);
  const departureDate = toDateOnly(item.waktu_keberangkatan);
  const departureTime = toClock(item.waktu_keberangkatan);
  const arrivalTime = toClock(item.waktu_kedatangan);
  const price = safePrice(item.harga_dasar);
  const sectorName = sanitizeText(item.nama_sector, "Penerbangan");
  const airlineName = getAirlineName(sectorName);
  const airlineCode = getAirlineCode(airlineName, id);
  const cabinClass = normalizeCabinClass(sectorName);

  if (!id || !originCode || !destinationCode || !departureDate) return null;

  return {
    id: String(id),
    airlineName,
    airlineCode,
    flightNumber: `${airlineCode}-${id}`,
    originCode,
    destinationCode,
    originName: sanitizeText(item.name_hub_asal),
    destinationName: sanitizeText(item.name_hub_tujuan),
    departureDate,
    departureTime,
    arrivalTime,
    durationMinutes: calculateDurationMinutes(item.waktu_keberangkatan, item.waktu_kedatangan),
    cabinClass,
    originalPrice: price,
    price,
    baggageCabinKg: 7,
    baggageCheckedKg: 20,
    refundable: false,
    reschedulable: false,
    quota: safeNumber(item.kuota),
    facilities: (item.fasilitas || []).map(mapFacility).filter(Boolean) as FlightFacility[],
  };
};

const mapApiSchedules = (items?: ApiFlightSchedule[] | null) => {
  return (items || [])
    .filter((item) => item.is_active !== false)
    .map(mapApiSchedule)
    .filter(Boolean) as FlightSchedule[];
};

const getProtectionTotal = (protectionIds: string[]) => {
  const selectedIds = new Set(protectionIds);

  return PROTECTION_OPTIONS.reduce((total, item) => {
    return selectedIds.has(item.id) ? total + item.price : total;
  }, 0);
};

const getBaggageOption = (baggageOptionId: string): BaggageOption => {
  return (
    BAGGAGE_OPTIONS.find((item) => item.id === baggageOptionId) ||
    BAGGAGE_OPTIONS[0]
  );
};

export const clonePassengers = (
  passengers: PassengerCounts = DEFAULT_PASSENGERS,
): PassengerCounts => ({
  adult: safeNumber(passengers.adult, 1),
  child: safeNumber(passengers.child),
  infant: safeNumber(passengers.infant),
});

export const normalizePassengers = (
  passengers: PassengerCounts = DEFAULT_PASSENGERS,
): PassengerCounts => {
  const adult = Math.min(Math.max(1, safeNumber(passengers.adult, 1)), 9);
  const child = Math.min(Math.max(0, safeNumber(passengers.child)), 8);
  const infant = Math.min(Math.max(0, safeNumber(passengers.infant)), adult);

  let next: PassengerCounts = { adult, child, infant };

  while (sumPassengers(next) > MAX_PASSENGER_TOTAL) {
    if (next.child > 0) {
      next = { ...next, child: next.child - 1 };
      continue;
    }

    if (next.infant > 0) {
      next = { ...next, infant: next.infant - 1 };
      continue;
    }

    if (next.adult > 1) {
      next = { ...next, adult: next.adult - 1 };
      continue;
    }

    break;
  }

  return next;
};

export const cloneSearchForm = (
  form: FlightSearchForm = DEFAULT_FLIGHT_SEARCH_FORM,
): FlightSearchForm => ({
  tripType: form.tripType === "roundTrip" ? "roundTrip" : "oneWay",
  originCode: normalizeCode(form.originCode),
  destinationCode: normalizeCode(form.destinationCode),
  departureDate: toDateOnly(form.departureDate),
  returnDate: form.tripType === "roundTrip" ? toDateOnly(form.returnDate) : "",
  cabinClass: isKnownCabinClass(form.cabinClass) ? form.cabinClass : "economy",
  passengers: normalizePassengers(form.passengers),
});

export const flightTicketService = Object.freeze({
  getAirports() {
    return [...airportCache];
  },

  async fetchAirports() {
    const response = await apiClient.get<ApiAirportResponse>("/utils/hubs/bandara");
    const airports = dedupeAirports(
      (response.data?.data || []).map(mapHubToAirport).filter(Boolean) as AirportOption[],
    );

    if (airports.length > 0) {
      airportCache = airports;
    }

    return [...airportCache];
  },

  getAirportByCode(code: string, airports?: AirportOption[]) {
    return findAirportByCode(code, airports);
  },

  validateSearchForm(form: FlightSearchForm, airports?: AirportOption[]) {
    const safeForm = cloneSearchForm(form);
    const passengerTotal = sumPassengers(safeForm.passengers);

    if (!isKnownAirport(safeForm.originCode, airports)) {
      return { valid: false, message: "Pilih bandara keberangkatan yang valid." };
    }

    if (!isKnownAirport(safeForm.destinationCode, airports)) {
      return { valid: false, message: "Pilih bandara tujuan yang valid." };
    }

    if (safeForm.originCode === safeForm.destinationCode) {
      return { valid: false, message: "Keberangkatan dan tujuan tidak boleh sama." };
    }

    if (!isPlainDate(safeForm.departureDate)) {
      return { valid: false, message: "Pilih tanggal keberangkatan yang valid." };
    }

    if (safeForm.tripType === "roundTrip" && !isPlainDate(safeForm.returnDate)) {
      return { valid: false, message: "Pilih tanggal pulang yang valid." };
    }

    if (!isKnownCabinClass(safeForm.cabinClass)) {
      return { valid: false, message: "Pilih kelas penerbangan yang valid." };
    }

    if (passengerTotal < 1 || passengerTotal > MAX_PASSENGER_TOTAL) {
      return {
        valid: false,
        message: "Jumlah penumpang harus 1 sampai 9 orang.",
      };
    }

    return { valid: true, message: "" };
  },

  async searchFlights(form: FlightSearchForm, airports?: AirportOption[]) {
    const safeForm = cloneSearchForm(form);
    const safeAirports = normalizeAirportList(airports);
    const validation = this.validateSearchForm(safeForm, safeAirports);

    if (!validation.valid) return [];

    const origin = findAirportByCode(safeForm.originCode, safeAirports);
    const destination = findAirportByCode(safeForm.destinationCode, safeAirports);

    const payload: Record<string, string | null> = {
      tipe_hub: AIRPORT_TYPE,
      hub_asal: getAirportIdForApi(origin, safeForm.originCode),
      hub_tujuan: getAirportIdForApi(destination, safeForm.destinationCode),
      tanggal_keberangkatan: safeForm.departureDate,
      tanggal_pulang: safeForm.tripType === "roundTrip" ? safeForm.returnDate : null,
    };

    const response = await apiClient.post<ApiScheduleSearchResponse>(
      "/jadwal/pesawat/cari",
      payload,
    );

    const schedules = mapApiSchedules(response.data?.data?.jadwal_keberangkatan);

    return schedules.filter((schedule) => {
      return (
        schedule.originCode === safeForm.originCode &&
        schedule.destinationCode === safeForm.destinationCode &&
        schedule.departureDate === safeForm.departureDate
      );
    });
  },

  calculatePassengerMultiplier(passengers: PassengerCounts) {
    const safePassengers = normalizePassengers(passengers);

    return (
      safePassengers.adult + safePassengers.child * 0.75 + safePassengers.infant * 0.1
    );
  },

  calculateOrderTotal({
    schedule,
    passengers,
    baggageOptionId,
    protectionIds,
  }: {
    schedule: FlightSchedule | null;
    passengers: PassengerCounts;
    baggageOptionId: string;
    protectionIds: string[];
  }) {
    if (!schedule) return 0;

    const ticketTotal = Math.round(
      schedule.price * this.calculatePassengerMultiplier(passengers),
    );

    return ticketTotal + getBaggageOption(baggageOptionId).price + getProtectionTotal(protectionIds);
  },

  createOrder({
    schedule,
    passengers,
    baggageOptionId,
    protectionIds,
    paymentMethodId,
  }: {
    schedule: FlightSchedule;
    passengers: PassengerCounts;
    baggageOptionId: string;
    protectionIds: string[];
    paymentMethodId: string;
  }): FlightOrder {
    const safePaymentMethodId = PAYMENT_METHODS.some(
      (method) => method.id === paymentMethodId,
    )
      ? paymentMethodId
      : PAYMENT_METHODS[0].id;

    const safeBaggageOptionId = getBaggageOption(baggageOptionId).id;
    const allowedProtectionIds = new Set(PROTECTION_OPTIONS.map((item) => item.id));
    const safeProtectionIds = protectionIds.filter((id) => allowedProtectionIds.has(id));

    return {
      id: `VYR-${Date.now().toString().slice(-8)}`,
      schedule,
      passengers: normalizePassengers(passengers),
      baggageOptionId: safeBaggageOptionId,
      protectionIds: safeProtectionIds,
      paymentMethodId: safePaymentMethodId,
      totalPrice: this.calculateOrderTotal({
        schedule,
        passengers,
        baggageOptionId: safeBaggageOptionId,
        protectionIds: safeProtectionIds,
      }),
      status: "waiting_payment",
      createdAt: new Date().toISOString(),
    };
  },
});
