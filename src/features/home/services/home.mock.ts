import { appImages } from "@/constants/assets";
import type { HomeDashboard } from "../types/home.types";

export const homeMockData: HomeDashboard = {
  categories: [
    { id: "bus", name: "Bus & Travel", icon: "bus" },
    { id: "train", name: "Kereta", icon: "train" },
    { id: "flight", name: "Pesawat", icon: "airplane" },
    { id: "hotel", name: "Hotel", icon: "bed" },
    { id: "trip", name: "Open Trip", icon: "map" },
  ],
  myTrips: [
    {
      id: "trip-1",
      title: "Open Trip - Gunung Semeru",
      subtitle: "16 - 17 Agustus",
      meta: "2 Orang",
      status: "Progress",
      image: appImages.onboardingThree,
    },
  ],
  recommendations: [
    {
      id: "rec-1",
      title: "Bromo Sunrise",
      subtitle: "Nikmati keindahan matahari terbit",
      image: appImages.onboardingOne,
    },
    {
      id: "rec-2",
      title: "Lake Escape",
      subtitle: "Trip santai bareng teman",
      image: appImages.onboardingTwo,
    },
  ],
  promos: [
    {
      id: "promo-1",
      title: "Diskon 25%",
      subtitle: "Bromo Sunrise",
      image: appImages.onboardingOne,
    },
    {
      id: "promo-2",
      title: "Cashback Travel",
      subtitle: "Lake Escape",
      image: appImages.onboardingTwo,
    },
  ],
};
