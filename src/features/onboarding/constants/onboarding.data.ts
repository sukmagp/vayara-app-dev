import { appImages } from "@/constants/assets";
import type { OnboardingItem } from "../types/onboarding.types";

export const onboardingItems: OnboardingItem[] = [
  {
    id: "healing-spot",
    title: "Cari Healing Spot",
    description: "Temukan destinasi kece yang cocok buat next escape kamu.",
    image: appImages.onboardingOne,
  },
  {
    id: "easy-trip",
    title: "Trip Jadi Gampang",
    description: "Atur jadwal, tiket, dan rencana perjalanan dalam satu aplikasi.",
    image: appImages.onboardingTwo,
  },
  {
    id: "open-trip",
    title: "Jalan Bareng Seru",
    description: "Ketemu teman trip baru dan mulai petualangan bareng.",
    image: appImages.onboardingThree,
  },
];
