import Header from "@/components/header";
import MovieCard from "@/components/moviecard";
import Slider from "@/components/slider";
import { fetchMovies } from "@/services/api";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

export default function App() {
  const {
    data:movies,
    loading:moviesLoading,
    error:moviesError
  } = useFetch(()=>fetchMovies({
    query:""
  }))
  const router = useRouter();
  const DATA = [
    {
      title: 'Trending',
    },
    {
      title: 'Popular',
    },
    {
      title: 'Latest Movies',
    },
    {
      title: 'Latest TV Series',
    },
  ];

  return (
    <View className="flex-1 bg-primary">
      <Header />
      
      <FlatList
        data={DATA}
        keyExtractor={(item, index) => item.title + index}
        ListHeaderComponent={moviesLoading?<ActivityIndicator
        size="large"
        className="self-center"
        />:<Slider movies={movies} />}
        ListFooterComponent={<View className="" />}
        renderItem={({ item }) => (
          <View className="mb-6">
            {/* Section Header */}
            <View className="flex w-full px-5 flex-row justify-between items-center mb-3">
              <Text style={{ fontWeight: "600" }} className="text-2xl text-[white]">
                {item.title}
              </Text>
              <Text className="text-secondary">See all</Text>
            </View>
            
            {/* Horizontal Items */}
            <FlatList
              data={movies?[...movies].sort(()=>0.5 - Math.random()):movies}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(dataItem, index) => dataItem + index}
              renderItem={({ item: dataItem }) => (
                <MovieCard {...dataItem}/>
          
              )}
              contentContainerStyle={{ paddingHorizontal: 5 ,gap:10}}
            />
          </View>
        )}
        contentContainerStyle={{gap:10}}
        className="bg-darkAccent"
      />
      

      <View className="flex w-full bg-darkAccent h-[120px]" />
    </View>
  );
}