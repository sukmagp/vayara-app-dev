import { FlatList, Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/layout/Screen";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { colors } from "@/theme";
import { CategoryCard } from "../components/CategoryCard";
import { HomeHeader } from "../components/HomeHeader";
import { PromoCard } from "../components/PromoCard";
import { SectionTitle } from "../components/SectionTitle";
import { TripCard } from "../components/TripCard";
import { useHomeDashboard } from "../hooks/useHomeDashboard";
import { styles } from "../styles/HomeScreen.styles";

export function HomeScreen() {
  const { data, isLoading, isError, refetch } = useHomeDashboard();

  if (isLoading && !data) {
    return <LoadingState message="Menyiapkan rekomendasi perjalanan..." />;
  }

  if (isError && !data) {
    return (
      <Screen contentStyle={{ justifyContent: "center" }}>
        <EmptyState
          title="Gagal memuat dashboard"
          description="Periksa koneksi atau coba lagi beberapa saat lagi."
          actionLabel="Coba Lagi"
          onActionPress={() => refetch()}
        />
      </Screen>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <HomeHeader />

        <View style={styles.heroText}>
          <Text style={styles.heroTitle}>Tentukan Perjalananmu</Text>
          <Text style={styles.heroSubtitle}>Temukan Ceritamu!</Text>
        </View>

        <Pressable accessibilityRole="button" style={styles.searchBox}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <Text style={styles.searchPlaceholder}>Cari destinasi...</Text>
        </Pressable>

        <SectionTitle title="Kategori" />
        <FlatList
          data={data.categories}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
          renderItem={({ item }) => <CategoryCard item={item} />}
        />

        <SectionTitle title="Perjalanan Saya" />
        {data.myTrips.map((trip) => (
          <TripCard key={trip.id} item={trip} />
        ))}

        <SectionTitle title="Rekomendasi" />
        <FlatList
          data={data.recommendations}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.promoList}
          renderItem={({ item }) => <PromoCard item={item} />}
        />

        <SectionTitle title="Promo" />
        <FlatList
          data={data.promos}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.promoList}
          renderItem={({ item }) => <PromoCard item={item} variant="deal" />}
        />

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </Screen>
  );
}
