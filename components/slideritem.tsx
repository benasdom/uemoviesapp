import { images } from '@/constants/images';
import { Image, Text, View } from 'react-native';
// This must match what is sent from Slider.tsx
 

const SliderItem = (item: Movie) => {
  return (
    <View key={`${item.id}`} className='items-center h-[350px] w-[200px] overflow-hidden rounded-xl'>
      <Image
        className="w-full h-full" 
        source={{uri:item.poster_path?`https://image.tmdb.org/t/p/w500${item.poster_path}}`:images.logo}}
        resizeMode="cover"
      />
         <View className="absolute bottom-0 w-full bg-black/40 p-2">
        <Text className="text-white text-center font-bold">{item.title}</Text>
      </View>
    </View>
  )
}

export default SliderItem