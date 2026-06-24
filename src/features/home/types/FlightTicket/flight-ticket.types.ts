export type CabinClass = "economy" | "business" | "first";

export type TripType = "oneWay" | "roundTrip";

export type BookingStep =
  | "search"
  | "results"
  | "detail"
  | "passenger"
  | "payment"
  | "status";

export type AirportOption = {
  id?: number | string;
  type?: string;
  code: string;
  city: string;
  name: string;
  label: string;
};

export type CabinClassOption = {
  id: CabinClass;
  label: string;
  description: string;
};

export type PassengerCounts = {
  adult: number;
  child: number;
  infant: number;
};

export type FlightSearchForm = {
  tripType: TripType;
  originCode: string;
  destinationCode: string;
  departureDate: string;
  returnDate: string;
  cabinClass: CabinClass;
  passengers: PassengerCounts;
};

export type FlightDateOption = {
  value: string;
  label: string;
  shortLabel: string;
};

export type FlightFacility = {
  id: number | string;
  name: string;
  category?: string;
  description?: string;
  extraDescription?: string;
};

export type FlightSchedule = {
  id: string;
  airlineName: string;
  airlineCode: string;
  flightNumber: string;
  originCode: string;
  destinationCode: string;
  originName?: string;
  destinationName?: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  cabinClass: CabinClass;
  originalPrice: number;
  price: number;
  baggageCabinKg: number;
  baggageCheckedKg: number;
  refundable: boolean;
  reschedulable: boolean;
  quota?: number;
  facilities?: FlightFacility[];
};

export type BaggageOption = {
  id: string;
  label: string;
  weightKg: number;
  price: number;
};

export type ProtectionOption = {
  id: string;
  title: string;
  description: string;
  price: number;
};

export type PaymentMethod = {
  id: string;
  label: string;
  description: string;
  icon: string;
};

export type FlightOrderStatus = "waiting_payment" | "paid" | "confirmed";

export type FlightOrder = {
  id: string;
  schedule: FlightSchedule;
  passengers: PassengerCounts;
  baggageOptionId: string;
  protectionIds: string[];
  paymentMethodId: string;
  totalPrice: number;
  status: FlightOrderStatus;
  createdAt: string;
};

export type PassengerKey = keyof PassengerCounts;
