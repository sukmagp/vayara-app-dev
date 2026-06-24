import type {
  AirportOption,
  BaggageOption,
  CabinClassOption,
  FlightDateOption,
  FlightSchedule,
  PaymentMethod,
  ProtectionOption,
} from "../../types/FlightTicket/flight-ticket.types";

const toDateValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatFlightDateLabel = (value: string, short = false) => {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, (month || 1) - 1, day || 1);
  return date.toLocaleDateString("id-ID", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    ...(short ? {} : { year: "numeric" }),
  });
};

const generateDateOptions = (start: string, totalDays: number): FlightDateOption[] => {
  const [year, month, day] = start.split("-").map(Number);
  const startDate = new Date(year, (month || 1) - 1, day || 1);

  return Array.from({ length: totalDays }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    const value = toDateValue(date);

    return {
      value,
      label: formatFlightDateLabel(value),
      shortLabel: formatFlightDateLabel(value, true),
    };
  });
};

export const AIRPORT_OPTIONS: AirportOption[] = [
  {
    id: 1,
    type: "bandara",
    code: "CGK",
    city: "Jakarta",
    name: "Soekarno-Hatta International Airport",
    label: "Jakarta (CGK)",
  },
  {
    id: 2,
    type: "bandara",
    code: "HLP",
    city: "Jakarta",
    name: "Halim Perdanakusuma International Airport",
    label: "Jakarta (HLP)",
  },
  {
    id: 3,
    type: "bandara",
    code: "SUB",
    city: "Surabaya",
    name: "Juanda International Airport",
    label: "Surabaya (SUB)",
  },
  {
    id: 4,
    type: "bandara",
    code: "DPS",
    city: "Bali",
    name: "Ngurah Rai International Airport",
    label: "Bali (DPS)",
  },
  {
    id: 5,
    type: "bandara",
    code: "KNO",
    city: "Medan",
    name: "Bandar Udara Internasional Kualanamu",
    label: "Medan (KNO)",
  },
  {
    id: 6,
    type: "bandara",
    code: "UPG",
    city: "Makassar",
    name: "Sultan Hasanuddin International Airport",
    label: "Makassar (UPG)",
  },
  {
    id: 8,
    type: "bandara",
    code: "BPN",
    city: "Balikpapan",
    name: "Sultan Aji Muhammad Sulaiman Sepinggan Airport",
    label: "Balikpapan (BPN)",
  },
  {
    id: 1663,
    type: "bandara",
    code: "TKG",
    city: "Lampung",
    name: "Radin Inten II Airport",
    label: "Lampung (TKG)",
  },
];

export const FLIGHT_DATE_OPTIONS: FlightDateOption[] = generateDateOptions(
  "2026-06-01",
  730,
);

export const CABIN_CLASS_OPTIONS: CabinClassOption[] = [
  {
    id: "economy",
    label: "Ekonomi",
    description: "Harga hemat untuk perjalanan ringan.",
  },
  {
    id: "business",
    label: "Bisnis",
    description: "Kursi lebih lega dan prioritas layanan.",
  },
  {
    id: "first",
    label: "First Class",
    description: "Kenyamanan premium selama penerbangan.",
  },
];

export const BAGGAGE_OPTIONS: BaggageOption[] = [
  { id: "bag-0", label: "0 Kg", weightKg: 0, price: 0 },
  { id: "bag-5", label: "5 Kg", weightKg: 5, price: 85000 },
  { id: "bag-10", label: "10 Kg", weightKg: 10, price: 150000 },
];

export const PROTECTION_OPTIONS: ProtectionOption[] = [
  {
    id: "full-protection",
    title: "Perlindungan Penuh",
    description: "Perlindungan perjalanan, keterlambatan, dan bagasi.",
    price: 100000,
  },
  {
    id: "baggage-protection",
    title: "Perlindungan Bagasi",
    description: "Proteksi jika bagasi terlambat atau rusak.",
    price: 18000,
  },
  {
    id: "delay-protection",
    title: "Proteksi Keterlambatan",
    description: "Kompensasi untuk keterlambatan penerbangan sesuai ketentuan.",
    price: 18000,
  },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "qris",
    label: "Qris",
    description: "Scan QR dari mobile banking atau e-wallet.",
    icon: "qr-code-outline",
  },
  {
    id: "bca-va",
    label: "BCA Virtual Account",
    description: "Bayar dari ATM, mobile banking, atau internet banking BCA.",
    icon: "card-outline",
  },
  {
    id: "bni-va",
    label: "BNI Virtual Account",
    description: "Bayar dari ATM, mobile banking, atau internet banking BNI.",
    icon: "card-outline",
  },
  {
    id: "mandiri-va",
    label: "Mandiri Virtual Account",
    description: "Bayar dari Livin, ATM, atau internet banking Mandiri.",
    icon: "card-outline",
  },
];

export const FLIGHT_SCHEDULES: FlightSchedule[] = [];
