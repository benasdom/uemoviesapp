import { icons } from '@/constants/icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ImageBackground, Text, TouchableOpacity, View } from 'react-native';

const MovieCard = (dataItem:Movie) => {
    const router = useRouter();
  return (
        <TouchableOpacity style={{width:125,backgroundColor:"rgba(250,250,250,.05)"}}
        className='flex items-center rounded-xl m-[3px]'
        onPress={()=>router.push(`movies/${encodeURIComponent(dataItem.id)}` as any)}>
                  <ImageBackground 
                  style={{height:200,width:"100%"}}
                className="bg-secondary rounded-xl"
                source={{
                  uri:dataItem.poster_path?
                  `https://image.tmdb.org/t/p/w500${dataItem.poster_path}`
                  :`https://placehold.co/600x400/1a1a1a/ffffff.png`}}
                >
                    <View style={{margin:2}} className="flex-row items-center bg-secondary w-[40] rounded-[5] self-end gap-x-1">
                        <Image style={{width:15,height:15,margin:3}} source={icons.star}/>
                        <Text className=" text-white text-xs">{Math.round(dataItem.vote_average/2)}</Text>
                    </View>
                </ImageBackground>
                <Text className="flex mt-[5] self-end px-1 text-secondary ">{dataItem.release_date?.split('-')[0]}</Text>
                  <Text style={{fontWeight:"800"}}  className="self-start text-white text-sm font-bold p-1  px-1" numberOfLines={1}>
                    {dataItem.title}</Text>

                </TouchableOpacity>
  )
}

export default MovieCard