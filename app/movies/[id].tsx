import { icons } from '@/constants/icons';
import { fetchMovieDetails } from '@/services/api';
import useFetch from '@/services/useFetch';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';


interface MovieInfoProps{
    label:string;
    value:string | number | null;
}
const MovieInfo = ({label,value}:MovieInfoProps)=>{
return (<View className='flex p-2 m-[5px]'>
    <Text className='text-textSecondary p-1  mt-5 font-heading'>
        {label}
    </Text>
    <Text className='text-sm text-white'>
        {value || 'N/A'}
    </Text>
</View>
)
}

const MovieDetails = () => {
    const router = useRouter()
    const {id} = useLocalSearchParams();
    const {data:movie,loading}= useFetch(()=>fetchMovieDetails(id as string))

  return (
    <View className='flex-1 bg-primary'>
    <ScrollView contentContainerStyle={{
        paddingBottom:80
    }}
    >
    <View>
        <Image source={{uri:`https://image.tmdb.org/t/p/w500${movie?.backdrop_path}`}} 
        className='w-full h-[300px]' resizeMode='cover'
        />
    </View>
    <View className="flex-col items-start justify-content mt-5 px-5">
        <Text className="text-white font-bold text-xl mt-2">
            {movie?.title}
        </Text>
        <View className="flex-row items-center gap-x-1 mt-2">
            <Text className='text-textSecondary text-sm'>
                {movie?.release_date?.split('-')[0]}
            </Text>
            <Text className='text-textSecondary'>
                {movie?.runtime}m
            </Text>
        </View>
        <View className="flex-row items-center bg-secondary rounded-lg p-2">
            <Image source={icons.star}
            className="size-4"
            />
            <Text className='text-white font-bold text-sm'>
                {' '}{Math.round(movie?.vote_average??0)}/10
            </Text>
            <Text className="text-textSecondary">
                {` (${movie?.vote_count} votes)`}
            </Text>
            
        </View>
        
        
            <MovieInfo label="Overview" value={movie?.overview}/>
        <MovieInfo label="Genres" value={movie?.genres?.map((g)=>g.name).join("-") || "N/A"}/>
      <View className='flex flex-row justify-between w-1/2'>
          <MovieInfo label="Budget" value={`$${movie?.budget/1_000_000} million`}/>
        <MovieInfo label="Revenue" value={`$${(movie?.revenue/1_000_000).toFixed()} million`}/>
      </View>
                <MovieInfo label="Production Companies" value={movie?.production_companies?.map((g)=>g.name).join("-") || "N/A"}/>

    </View>
    </ScrollView>
    <TouchableOpacity onPress={()=>router.back()} className='absolute flex justify-center items-center rounded-xl bg-secondary ' style={{width:50,height:50, top:0, margin:10, marginTop:60}}>
<Image tintColor={"white"} className='size-6' source={icons.arrowLeft}/>
    </TouchableOpacity>
    <View className=' flex self-center justify-center items-center rounded-xl w-full' style={{height:140,bottom:0,padding:30,marginBottom:9}} >
    <TouchableOpacity onPress={()=>router.push("movies/videourls")} className=' flex flex-row self-center justify-center items-center rounded-xl bg-secondary w-full' style={{height:60,bottom:0,marginBottom:9}} >
<Image tintColor={"white"} style={{width:20, height:20}} source={icons.play}/>
   <Text className='flex justify-center align-center text-white p-2'>Play</Text>
    </TouchableOpacity>
    </View>

    </View>
  )
}

export default MovieDetails