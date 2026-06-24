import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BAGGAGE_OPTIONS,
  PAYMENT_METHODS,
  PROTECTION_OPTIONS,
} from "../../services/FlightTicket/flight-ticket.mock";
import {
  cloneSearchForm,
  DEFAULT_FLIGHT_SEARCH_FORM,
  flightTicketService,
  normalizePassengers,
} from "../../services/FlightTicket/flight-ticket.service";
import type {
  AirportOption,
  BookingStep,
  CabinClass,
  FlightOrder,
  FlightSchedule,
  FlightSearchForm,
  PassengerCounts,
  PassengerKey,
} from "../../types/FlightTicket/flight-ticket.types";

const PAYMENT_DURATION_SECONDS = 60 * 60;
const PASSENGER_MAX_TOTAL = 9;

const sumPassengers = (passengers: PassengerCounts) =>
  passengers.adult + passengers.child + passengers.infant;

const sanitizeProtectionIds = (ids: string[]) => {
  const allowedIds = new Set(PROTECTION_OPTIONS.map((item) => item.id));
  return Array.from(new Set(ids.filter((id) => allowedIds.has(id))));
};

const normalizeBaggageId = (id: string) => {
  return BAGGAGE_OPTIONS.some((item) => item.id === id)
    ? id
    : BAGGAGE_OPTIONS[0].id;
};

const normalizePaymentId = (id: string) => {
  return PAYMENT_METHODS.some((item) => item.id === id)
    ? id
    : PAYMENT_METHODS[0].id;
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message.trim()) return error.message.trim();
  return "Tidak bisa mengambil data jadwal. Silakan coba lagi.";
};

export function useFlightTicketBooking() {
  const [step, setStep] = useState<BookingStep>("search");
  const [form, setForm] = useState<FlightSearchForm>(() =>
    cloneSearchForm(DEFAULT_FLIGHT_SEARCH_FORM),
  );
  const [airports, setAirports] = useState<AirportOption[]>(() =>
    flightTicketService.getAirports(),
  );
  const [results, setResults] = useState<FlightSchedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] =
    useState<FlightSchedule | null>(null);
  const [selectedBaggageId, setSelectedBaggageId] = useState(
    BAGGAGE_OPTIONS[0].id,
  );
  const [selectedProtectionIds, setSelectedProtectionIds] = useState<string[]>([]);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(
    PAYMENT_METHODS[0].id,
  );
  const [order, setOrder] = useState<FlightOrder | null>(null);
  const [paymentRemainingSeconds, setPaymentRemainingSeconds] = useState(
    PAYMENT_DURATION_SECONDS,
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoadingAirports, setIsLoadingAirports] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const totalPrice = useMemo(
    () =>
      flightTicketService.calculateOrderTotal({
        schedule: selectedSchedule,
        passengers: form.passengers,
        baggageOptionId: selectedBaggageId,
        protectionIds: selectedProtectionIds,
      }),
    [form.passengers, selectedBaggageId, selectedProtectionIds, selectedSchedule],
  );

  useEffect(() => {
    let mounted = true;

    setIsLoadingAirports(true);
    flightTicketService
      .fetchAirports()
      .then((nextAirports) => {
        if (!mounted) return;
        setAirports(nextAirports);
      })
      .catch(() => {
        if (!mounted) return;
        setAirports(flightTicketService.getAirports());
      })
      .finally(() => {
        if (!mounted) return;
        setIsLoadingAirports(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (step !== "payment" || !order || order.status !== "waiting_payment") {
      return undefined;
    }

    const intervalId = setInterval(() => {
      setPaymentRemainingSeconds((currentSeconds) => Math.max(0, currentSeconds - 1));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [order, step]);

  const clearError = useCallback(() => setErrorMessage(""), []);

  const updateFormField = useCallback(
    <Key extends keyof FlightSearchForm>(field: Key, value: FlightSearchForm[Key]) => {
      setForm((currentForm) => {
        const nextForm = cloneSearchForm({
          ...currentForm,
          [field]: value,
        });

        if (field === "originCode" && nextForm.originCode === nextForm.destinationCode) {
          nextForm.destinationCode = "";
        }

        if (field === "destinationCode" && nextForm.originCode === nextForm.destinationCode) {
          nextForm.originCode = "";
        }

        return nextForm;
      });
      clearError();
    },
    [clearError],
  );

  const applyPassengerSelection = useCallback(
    (cabinClass: CabinClass, passengers: PassengerCounts) => {
      setForm((currentForm) =>
        cloneSearchForm({
          ...currentForm,
          cabinClass,
          passengers: normalizePassengers(passengers),
        }),
      );
      clearError();
    },
    [clearError],
  );

  const changePassengerCount = useCallback(
    (key: PassengerKey, direction: 1 | -1) => {
      setForm((currentForm) => {
        const currentPassengers = normalizePassengers(currentForm.passengers);
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

        if (sumPassengers(nextPassengers) > PASSENGER_MAX_TOTAL) {
          return currentForm;
        }

        return cloneSearchForm({
          ...currentForm,
          passengers: normalizePassengers(nextPassengers),
        });
      });
      clearError();
    },
    [clearError],
  );

  const submitSearch = useCallback(
    async (overrides: Partial<FlightSearchForm> = {}) => {
      const searchForm = cloneSearchForm({
        ...form,
        ...overrides,
      });
      const validation = flightTicketService.validateSearchForm(searchForm, airports);

      if (!validation.valid) {
        setErrorMessage(validation.message);
        return false;
      }

      setForm(searchForm);
      setSelectedSchedule(null);
      setResults([]);
      setErrorMessage("");
      setIsSearching(true);
      setStep("results");

      try {
        const nextResults = await flightTicketService.searchFlights(searchForm, airports);
        setResults(nextResults);
        return true;
      } catch (error) {
        setErrorMessage(getErrorMessage(error));
        setResults([]);
        return false;
      } finally {
        setIsSearching(false);
      }
    },
    [airports, form],
  );

  const selectSchedule = useCallback((schedule: FlightSchedule) => {
    setSelectedSchedule(schedule);
    setErrorMessage("");
    setStep("detail");
  }, []);

  const continueToPassenger = useCallback(() => {
    if (!selectedSchedule) {
      setErrorMessage("Pilih jadwal penerbangan terlebih dahulu.");
      return;
    }

    setErrorMessage("");
    setStep("passenger");
  }, [selectedSchedule]);

  const toggleProtection = useCallback((id: string) => {
    setSelectedProtectionIds((currentIds) => {
      const safeCurrentIds = sanitizeProtectionIds(currentIds);

      if (safeCurrentIds.includes(id)) {
        return safeCurrentIds.filter((currentId) => currentId !== id);
      }

      return sanitizeProtectionIds([...safeCurrentIds, id]);
    });
  }, []);

  const selectBaggage = useCallback((id: string) => {
    setSelectedBaggageId(normalizeBaggageId(id));
  }, []);

  const selectPaymentMethod = useCallback((id: string) => {
    setSelectedPaymentMethodId(normalizePaymentId(id));
  }, []);

  const continueToPayment = useCallback(() => {
    if (!selectedSchedule) {
      setErrorMessage("Detail penerbangan tidak valid.");
      return;
    }

    const nextOrder = flightTicketService.createOrder({
      schedule: selectedSchedule,
      passengers: form.passengers,
      baggageOptionId: selectedBaggageId,
      protectionIds: selectedProtectionIds,
      paymentMethodId: selectedPaymentMethodId,
    });

    setOrder(nextOrder);
    setPaymentRemainingSeconds(PAYMENT_DURATION_SECONDS);
    setErrorMessage("");
    setStep("payment");
  }, [
    form.passengers,
    selectedBaggageId,
    selectedPaymentMethodId,
    selectedProtectionIds,
    selectedSchedule,
  ]);

  const payNow = useCallback(() => {
    if (!order) {
      setErrorMessage("Order pembayaran tidak ditemukan.");
      return;
    }

    setOrder({
      ...order,
      paymentMethodId: normalizePaymentId(selectedPaymentMethodId),
      status: "confirmed",
    });
    setErrorMessage("");
    setStep("status");
  }, [order, selectedPaymentMethodId]);

  const goBack = useCallback(() => {
    setErrorMessage("");

    setStep((currentStep) => {
      if (currentStep === "status") return "payment";
      if (currentStep === "payment") return "passenger";
      if (currentStep === "passenger") return "detail";
      if (currentStep === "detail") return "results";
      if (currentStep === "results") return "search";
      return "search";
    });
  }, []);

  const resetFlow = useCallback(() => {
    setStep("search");
    setForm(cloneSearchForm(DEFAULT_FLIGHT_SEARCH_FORM));
    setResults([]);
    setSelectedSchedule(null);
    setSelectedBaggageId(BAGGAGE_OPTIONS[0].id);
    setSelectedProtectionIds([]);
    setSelectedPaymentMethodId(PAYMENT_METHODS[0].id);
    setOrder(null);
    setPaymentRemainingSeconds(PAYMENT_DURATION_SECONDS);
    setErrorMessage("");
    setIsSearching(false);
  }, []);

  return {
    step,
    form,
    airports,
    results,
    selectedSchedule,
    selectedBaggageId,
    selectedProtectionIds,
    selectedPaymentMethodId,
    order,
    totalPrice,
    paymentRemainingSeconds,
    errorMessage,
    isLoadingAirports,
    isSearching,
    clearError,
    updateFormField,
    applyPassengerSelection,
    changePassengerCount,
    submitSearch,
    selectSchedule,
    continueToPassenger,
    selectBaggage,
    toggleProtection,
    selectPaymentMethod,
    continueToPayment,
    payNow,
    goBack,
    resetFlow,
  };
}
