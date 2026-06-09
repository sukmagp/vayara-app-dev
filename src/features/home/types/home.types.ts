import type { ImageSourcePropType } from "react-native";

export type SafeImageSource = {
  image?: ImageSourcePropType;
  imageUrl?: string | null;
};

export type TravelCategory = SafeImageSource & {
  id: string;
  name: string;
  icon: string;
};

export type TripCard = SafeImageSource & {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  status: string;
};

export type PromoCard = SafeImageSource & {
  id: string;
  title: string;
  subtitle: string;
  badgeLabel?: string;
};

export type TopDeal = SafeImageSource & {
  id: string;
  title: string;
  location: string;
  rating: number;
  reviewCount: number;
  originalPrice: number;
  price: number;
  discountPercent: number;
  tag?: string;
};

export type HomeDashboard = {
  categories: TravelCategory[];
  myTrips: TripCard[];
  recommendations: PromoCard[];
  promos: PromoCard[];
  topDeals: TopDeal[];
};