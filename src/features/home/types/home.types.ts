import { ImageSourcePropType } from "react-native";

export type TravelCategory = {
  id: string;
  name: string;
  icon: string;
};

export type TripCard = {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  status: string;
  image?: ImageSourcePropType;
  imageUrl?: string | null;
};

export type PromoCard = {
  id: string;
  title: string;
  subtitle: string;
  image?: ImageSourcePropType;
  imageUrl?: string | null;
};

export type HomeDashboard = {
  categories: TravelCategory[];
  myTrips: TripCard[];
  recommendations: PromoCard[];
  promos: PromoCard[];
};
