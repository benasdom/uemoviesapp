import Header from "@/components/header";
import MovieCard from "@/components/moviecard";
import Slider from "@/components/slider";
import { fetchMovies, fetchNowPlayingMovies, fetchTrendingMovies, fetchTVSeries } from "@/services/api";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

export default function App() {
  const { data: popularMovies, loading: popularLoading } = useFetch(() => fetchMovies({ query: "" }));
  const { data: trendingMovies, loading: trendingLoading } = useFetch(fetchTrendingMovies);
  const { data: latestMovies, loading: latestLoading } = useFetch(fetchNowPlayingMovies);
  const { data: tvSeries, loading: tvLoading } = useFetch(fetchTVSeries);

  const router = useRouter();

  // Each item now carries its own data and loading state
 const DATA = [
  { title: 'Latest TV Series', movies: tvSeries,       loading: tvLoading,       mediaType: 'tv'    as const },
  { title: 'Trending',         movies: trendingMovies, loading: trendingLoading, mediaType: 'movie' as const },
  { title: 'Popular',          movies: popularMovies,  loading: popularLoading,  mediaType: 'movie' as const }
];

  const sliderLoading = popularLoading || trendingLoading;
  return (
    <View className="flex-1 bg-primary">
      <Header />

      <FlatList
        data={DATA}
        keyExtractor={(item) => item.title}
        ListHeaderComponent={
          sliderLoading
            ? <ActivityIndicator size="large" className="self-center" />
            : <Slider movies={trendingMovies} />   // Slider now shows real trending data
        }
        ListFooterComponent={<View />}
        renderItem={({ item }) => (
          <View className="mb-6">
            <View className="flex w-full px-5 flex-row justify-between items-center mb-3">
              <Text style={{ fontWeight: "600" }} className="text-2xl text-[white]">
                {item.title}
              </Text>
              <Text className="text-secondary">See all</Text>
            </View>

            {item.loading ? (
              <ActivityIndicator size="small" className="self-center py-4" />
            ) : (
              <FlatList
                data={item.movies}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(dataItem, index) => dataItem.id?.toString() ?? index.toString()}
                renderItem={({ item: dataItem }) => (<MovieCard {...dataItem} mediaType={item.mediaType} />)}
               contentContainerStyle={{ paddingHorizontal: 5, gap: 10 }}
              />
            )}
          </View>
        )}
        contentContainerStyle={{ gap: 10 }}
        className="bg-darkAccent"
      />

      <View className="flex w-full bg-darkAccent h-[120px]" />
    </View>
  );
}