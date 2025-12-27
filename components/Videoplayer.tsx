import { icons } from '@/constants/icons'
import { useRouter } from 'expo-router'
import { useVideoPlayer, VideoView } from 'expo-video'
import React from 'react'
import { Dimensions, Image, TouchableOpacity, View } from 'react-native'

const localsource = "C:/Users/BTC/Documents/Learn%20Regular%20Expressions%20In%2020%20Minutes.mp4"
const Videoplayer = () => {
    const router=useRouter()
    const player = useVideoPlayer(localsource,(player)=>{
        player.play()
    })
  return (
    <View className='absolute flex h-full items-center justify-center bg-primary'>
            <TouchableOpacity onPress={()=>router.back()} className='absolute flex justify-center items-center rounded-xl bg-secondary ' style={{width:50,left:0,height:50, top:0, margin:10}}>
        <Image tintColor={"white"} className='size-6' source={icons.arrowLeft}/>
            </TouchableOpacity>
        <VideoView
        player={player}
        style={{
            marginTop:-200,
            width:Dimensions.get("window").width,
            height:Dimensions.get("window").width * (9/16)
        }}
        />


    </View>
  )
}

export default Videoplayer

// import { ResizeMode, Video } from "expo-av";
// import Ionicons from '@expo/vector-icons/Ionicons';
// import { router, useLocalSearchParams } from 'expo-router';
// import { useVideoPlayer, VideoView } from "expo-video";
// import React, { useEffect, useRef, useState } from 'react';
// import { ActivityIndicator, Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// interface MoviePayload {
//     playLink: string;
//     // add other properties if needed
// }

// const PlayMovie = () => {
//     const { title } = useLocalSearchParams();
//     const videoRef = useRef(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [videoUri, setVideoUri] = useState<string | null>(null);
//     const [payload, setPayload] = useState<MoviePayload[] | null>(null);
//     const baseUrl = "http://192.168.100.8:8000";

//     useEffect(() => {
//         console.clear()
//         const fetchMovie = async () => {
//             try {
//                 setLoading(true);
//                 const data = await movieData();
//                 setPayload(data);
//                 console.clear();
//                 console.log('Movie data:', data);
//                 // compute full playLink URL and set as videoUri
//                 const play = data && data[0] && data[0].playLink;
//                 if (play) {
//                     const full = play.startsWith('http') ? play : `${baseUrl}${play}`;
//                     console.log('Computed play URL:', full);
//                     setVideoUri(full);
//                 } else {
//                     setVideoUri(null);
//                 }
//             } catch (err) {
//                 const errorMessage = err instanceof Error ? err.message : 'An error occurred';
//                 setError(errorMessage);

//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchMovie();
//     }, [title]);

//     const movieData = async () => {
//         try {
//             const response = await fetch(`${baseUrl}/movies?query=${title}`);
//             const data = await response.json();
//             console.log(data)
//             return data;
//         } catch (error) {
//             console.error('Error fetching movie data:', error);
//             throw error;
//         }
//     }
//     const player = useVideoPlayer(videoUri)

//     useEffect(() => {
//         // Debug player object and attempt to start playback if possible
//         if (!player) return;
//         // Some player implementations expose a `play` or `playAsync` method
//         try {
//             // @ts-ignore
//             if (typeof player.playAsync === 'function') {
//                 // @ts-ignore
//                 player.playAsync().catch((e: any) => Alert.alert('playAsync failed:', e));
//             } else if (typeof player.play === 'function') {
//                 // @ts-ignore
//                 player.play();
//             }
//         } catch (err) {
//             Alert.alert('Error attempting auto-play on player:', `${err}`);
//         }
//     }, [player]);

//     return (
//         <View style={styles.container}>

//             {loading ? (
//                 <View style={{ position: "absolute", justifyContent: "center", alignItems: "center" }}>
//                     <ActivityIndicator
//                         size="small"
//                         color="#b4b4e4ff"
//                         className="mt-10 self-center"
//                     />
//                 </View>
//             ) : videoUri ? (
//                 <VideoView
//                     // ref={videoRef}
//                     key={videoUri}
//                     player={player}
//                     allowsFullscreen
//                     allowsPictureInPicture
//                     style={{
//                         width: Dimensions.get("window").width,
//                         height: Dimensions.get("window").width * (9 / 10),
//                     }}
//                 />
//             ) : (
//                 <View>
//                     <Text className='text-light-100 font-bold text-sm mt-2'> Oops Something went wrong</Text>
//                     <TouchableOpacity
//                         className=" top-5 w-[45] h-[40] left-0 right-0 mx-5 bg-accent rounded-lg flex-row items-center justify-center z-50"
//                         onPress={router.back}
//                     >
//                         <Ionicons style={{ transform: "rotate(-90deg)" }} name="arrow-up" size={24} color="white" />

//                     </TouchableOpacity>
//                 </View>
//                 // <ActivityIndicator
//                 //     size="small"
//                 //     // color="#b4b4e4ff"
//                 //     color="red"
//                 //     className="mt-10 self-center"
//                 // />
//             )}
//         </View>
//     )
// };

// const { width, height } = Dimensions.get("window");

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "black",
//         justifyContent: 'center',
//         alignItems: 'center'
//     },
//     video: {
//         width: width,
//         height: height * 0.9, // 90% of screen height
//         alignSelf: 'center'
//     }
// })
// export default PlayMovie;
