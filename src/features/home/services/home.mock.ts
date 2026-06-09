import type { ImageSourcePropType } from "react-native";

import { appImages } from "@/constants/assets";
import type { HomeDashboard, TopDeal } from "../types/home.types";

const assetMap = appImages as unknown as Record<string, ImageSourcePropType>;

const resolveAsset = (
  keys: string[],
  fallback: ImageSourcePropType,
): ImageSourcePropType => {
  for (const key of keys) {
    const asset = assetMap[key];

    if (asset) return asset;
  }

  return fallback;
};

const hotelImage = resolveAsset(
  ["imagesHotel", "images-hotel", "hotel", "hotelImage"],
  appImages.onboardingTwo,
);

const topDealNames = [
  "Fairmont Hotel",
  "Vayara Grand Hotel",
  "Aston Urban Stay",
  "Bromo Hills Resort",
  "Semeru Valley Lodge",
  "Jakarta City Hotel",
  "Royal Heritage Hotel",
  "Sunset View Resort",
  "The Alana Suites",
  "Lake Side Villa",
];

const locations = [
  "Tanah Abang, Jakarta",
  "Menteng, Jakarta",
  "Tosari, Pasuruan",
  "Cisarua, Bogor",
  "Kuta, Bali",
  "Bandung Wetan, Bandung",
  "Batu, Malang",
  "Ubud, Gianyar",
  "Sleman, Yogyakarta",
  "Sentul, Bogor",
];

const createTopDeals = (): TopDeal[] =>
  Array.from({ length: 20 }, (_, index) => {
    const currentIndex = index + 1;
    const basePrice = 1200000 + index * 45000;
    const discountPercent = 25 + (index % 5) * 5;
    const price = Math.round(basePrice * (1 - discountPercent / 100));

    return {
      id: `deal-${currentIndex}`,
      title: topDealNames[index % topDealNames.length],
      location: locations[index % locations.length],
      rating: Number((8 + (index % 8) / 10).toFixed(1)),
      reviewCount: 280 + index * 37,
      originalPrice: basePrice,
      price,
      discountPercent,
      tag: index % 3 === 0 ? "Best Deal" : "Promo",
      image: hotelImage,
    };
  });

export const homeStaticData: HomeDashboard = {
  categories: [
    {
      id: "open-trip",
      name: "Open Trip",
      icon: "map-outline",
    },
    {
      id: "flight",
      name: "Pesawat",
      icon: "airplane-outline",
    },
    {
      id: "train",
      name: "Kereta",
      icon: "train-outline",
    },
    {
      id: "hotel",
      name: "Hotel",
      icon: "bed-outline",
    },
    {
      id: "bus-travel",
      name: "Bus & Travel",
      icon: "bus-outline",
    },
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
      badgeLabel: "Pilihan Vayara",
      image: appImages.onboardingOne,
    },
    {
      id: "rec-2",
      title: "Lake Escape",
      subtitle: "Trip santai untuk healing bareng teman.",
      badgeLabel: "Pilihan Vayara",
      image: appImages.onboardingTwo,
    },
    {
      id: "rec-3",
      title: "Semeru Weekend",
      subtitle: "Pendakian singkat dengan itinerary rapi.",
      badgeLabel: "Pilihan Vayara",
      image: appImages.onboardingThree,
    },
  ],

  promos: [],
  topDeals: createTopDeals(),
};

export const homeMockData = homeStaticData;