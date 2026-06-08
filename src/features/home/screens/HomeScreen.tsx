import { Ionicons } from "@expo/vector-icons";
import { useCallback, useMemo } from "react";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";

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
import type {
  PromoCard as PromoCardType,
  TravelCategory,
  TripCard as TripCardType,
} from "../types/home.types";

export function HomeScreen() {
  const { data, isLoading, isError, refetch } = useHomeDashboard();

  const categories = useMemo(() => data?.categories ?? [], [data?.categories]);
  const myTrips = useMemo(() => data?.myTrips ?? [], [data?.myTrips]);
  const recommendations = useMemo(
    () => data?.recommendations ?? [],
    [data?.recommendations],
  );

  const activeTripCount = myTrips.length;
  const recommendationCount = recommendations.length;

  const handleSearchPress = useCallback(() => {
    // TODO: Hubungkan ke search screen setelah flow pencarian siap.
  }, []);

  const handleCategoryPress = useCallback((_item: TravelCategory) => {
    // TODO: Hubungkan ke category detail setelah route tersedia.
  }, []);

  const handleTripPress = useCallback((_item: TripCardType) => {
    // TODO: Hubungkan ke trip detail setelah route tersedia.
  }, []);

  const handleRecommendationPress = useCallback((_item: PromoCardType) => {
    // TODO: Hubungkan ke recommendation detail setelah route tersedia.
  }, []);

  const renderCategory = useCallback(
    ({ item }: { item: TravelCategory }) => (
      <CategoryCard item={item} onPress={handleCategoryPress} />
    ),
    [handleCategoryPress],
  );

  const renderRecommendation = useCallback(
    ({ item }: { item: PromoCardType }) => (
      <PromoCard item={item} onPress={handleRecommendationPress} />
    ),
    [handleRecommendationPress],
  );

  if (isLoading && !data) {
    return (
      <Screen edges={["top", "left", "right", "bottom"]}>
        <LoadingState message="Menyiapkan dashboard perjalanan..." />
      </Screen>
    );
  }

  if (isError && !data) {
    return (
      <Screen
        edges={["top", "left", "right", "bottom"]}
        contentStyle={styles.centerContent}
      >
        <EmptyState
          title="Gagal memuat dashboard"
          description="Periksa koneksi atau coba lagi beberapa saat lagi."
          actionLabel="Coba Lagi"
          onActionPress={() => {
            void refetch();
          }}
        />
      </Screen>
    );
  }

  if (!data) {
    return (
      <Screen
        edges={["top", "left", "right", "bottom"]}
        contentStyle={styles.centerContent}
      >
        <EmptyState
          title="Dashboard belum tersedia"
          description="Data perjalanan belum bisa ditampilkan saat ini."
        />
      </Screen>
    );
  }

  return (
    <Screen edges={["top", "left", "right"]} statusBarStyle="dark-content">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <HomeHeader
          userName="Sukmagp"
          notificationCount={3}
        />

        <View style={styles.heroCard}>
          <View style={styles.heroOrnamentOne} />
          <View style={styles.heroOrnamentTwo} />

          <View style={styles.heroEyebrow}>
            <Ionicons name="sparkles-outline" size={13} color={colors.white} />
            <Text style={styles.heroEyebrowText}>Explore your next story</Text>
          </View>

          <Text style={styles.heroTitle}>
            Tentukan perjalananmu, temukan ceritamu.
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cari destinasi"
          onPress={handleSearchPress}
          style={({ pressed }) => [
            styles.searchBox,
            pressed ? styles.searchPressed : null,
          ]}
        >
          <Ionicons name="search-outline" size={19} color={colors.textMuted} />

          <Text numberOfLines={1} style={styles.searchPlaceholder}>
            Cari destinasi, trip, atau transportasi...
          </Text>
        </Pressable>

        <SectionTitle
          title="Kategori"
          subtitle="Pilih layanan perjalanan sesuai kebutuhanmu."
        />

        {categories.length > 0 ? (
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
            renderItem={renderCategory}
          />
        ) : (
          <View style={styles.listEmptyCard}>
            <Text style={styles.listEmptyText}>
              Kategori perjalanan belum tersedia.
            </Text>
          </View>
        )}

        <SectionTitle
          title="Perjalanan Saya"
          subtitle="Pantau rencana perjalanan yang sedang berjalan."
        />

        {myTrips.length > 0 ? (
          <View style={styles.tripList}>
            {myTrips.map((trip) => (
              <TripCard key={trip.id} item={trip} onPress={handleTripPress} />
            ))}
          </View>
        ) : (
          <View style={styles.listEmptyCard}>
            <Text style={styles.listEmptyText}>
              Kamu belum memiliki perjalanan aktif.
            </Text>
          </View>
        )}

        <SectionTitle
          title="Rekomendasi"
          subtitle="Inspirasi destinasi pilihan untuk perjalanan berikutnya."
        />

        {recommendations.length > 0 ? (
          <FlatList
            data={recommendations}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendationList}
            renderItem={renderRecommendation}
          />
        ) : (
          <View style={styles.listEmptyCard}>
            <Text style={styles.listEmptyText}>
              Rekomendasi perjalanan belum tersedia.
            </Text>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </Screen>
  );
}