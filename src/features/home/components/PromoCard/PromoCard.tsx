import { Image, ImageBackground, Pressable, Text, View } from "react-native";
import { appImages } from "@/constants/assets";
import type { PromoCard as PromoCardType } from "../../types/home.types";
import { styles } from "./PromoCard.styles";

type PromoCardProps = {
  item: PromoCardType;
  variant?: "banner" | "deal";
  onPress?: (item: PromoCardType) => void;
};

export function PromoCard({ item, variant = "banner", onPress }: PromoCardProps) {
  const imageSource = item.image || (item.imageUrl ? { uri: item.imageUrl } : appImages.onboardingOne);

  if (variant === "deal") {
    return (
      <Pressable accessibilityRole="button" onPress={() => onPress?.(item)} style={styles.dealCard}>
        <Image source={imageSource} resizeMode="cover" style={styles.dealImage} />
        <View style={styles.dealContent}>
          <Text style={styles.dealTitle}>{item.title}</Text>
          <Text style={styles.dealSubtitle}>{item.subtitle}</Text>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable accessibilityRole="button" onPress={() => onPress?.(item)} style={styles.promoCard}>
      <ImageBackground
          source={imageSource}
          resizeMode="cover"
          imageStyle={styles.promoImage}
          style={styles.promoImageWrap}
        >
          <View style={styles.promoOverlay}>
            <Text style={styles.promoTitle}>{item.title}</Text>
            <Text style={styles.promoSubtitle}>{item.subtitle}</Text>
          </View>
        </ImageBackground>
    </Pressable>
  );
}
