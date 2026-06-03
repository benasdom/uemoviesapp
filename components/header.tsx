import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from 'react-native';

const Header = () => {
  const router = useRouter();
  return (
   <View >
     <View className='flex flex-row justify-between mt-[35]' >

    <View className='flex flex-row items-center justify-center p-2 ' >
        <Text style={{fontWeight:"800"}} className='ml-[30px] flex flex-row font-heading text-4xl items-center text-sm justify-center text-[white] tracking-wider' >UE</Text>

        <Image className='w-[40] h-[40] rounded-full ml-[5] mr-[5]' source={images.logo}/>
        <Text style={{fontWeight:"800"}} className='flex flex-row font-heading text-4xl items-center text-sm justify-center text-[white] tracking-wider' >MOVIES</Text>
    </View>
    <View className='flex flex-row w-[100] justify-around items-center'>
      
    <TouchableOpacity onPress={()=>router.push("/search")} className='justify-center'>
        <Image tintColor={"#ffffff"} className='w-[20] h-[20] ' source={icons.search}/>
    </TouchableOpacity>
 <TouchableOpacity onPress={()=>router.push("/profile")}
  className='flex items-center justify-center rounded-full bg-gray-500 w-[40px] h-[40px]'
>
  <Image 
    tintColor="whitesmoke" 
    className='bg-gray-500 rounded-full w-[30] h-[30]' 
    source={icons.person}
  />
</TouchableOpacity>
    </View>
    </View>
  
   </View>

  )
}


export default Header
