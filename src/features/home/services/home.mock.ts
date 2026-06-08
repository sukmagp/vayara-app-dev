import { appImages } from "@/constants/assets";
import type { HomeDashboard } from "../types/home.types";

export const homeStaticData: HomeDashboard = {
  categories: [
    { id: "open-trip", name: "Open Trip", icon: "map-outline" },
    { id: "flight", name: "Pesawat", icon: "airplane-outline" },
    { id: "train", name: "Kereta", icon: "train-outline" },
    { id: "hotel", name: "Hotel", icon: "bed-outline" },
    { id: "bus", name: "Travel", icon: "bus-outline" },
  ],

  myTrips: [
    {
      id: "trip-1",
      title: "Open Trip Gunung Semeru",
      subtitle: "16 - 17 Agustus 2026",
      meta: "2 Orang",
      status: "Berjalan",
      image: appImages.onboardingThree,
    },
  ],

  recommendations: [
    {
      id: "rec-1",
      title: "Bromo Sunrise",
      subtitle: "Nikmati sunrise terbaik dari Penanjakan.",
      image: appImages.onboardingOne,
    },
    {
      id: "rec-2",
      title: "Lake Escape",
      subtitle: "Trip santai untuk healing bareng teman.",
      image: appImages.onboardingTwo,
    },
    {
      id: "rec-3",
      title: "Semeru Weekend",
      subtitle: "Pendakian singkat dengan itinerary rapi.",
      image: appImages.onboardingThree,
    },
  ],

  promos: [],
};

export const homeMockData = homeStaticData;