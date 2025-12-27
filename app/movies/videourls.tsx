import Videoplayer from '@/components/Videoplayer'
import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

const VideoUrls = () => {
    const [showVideo,setshowVIdeo] = useState(false)
  return (
    <View className='bg-darkAccent'>
        <View className='mt-[50] h-full'>
             
               <View>
                      <Text className='text-bold text-white p-5'>Available links  </Text>
                      <TouchableOpacity className='flex text-[whitesmoke] rounded-lg text-bold h-[50] m-[10] bg-secondary items-center justify-center ' onPress={()=>setshowVIdeo((prev)=>prev=!prev)}>
                        <Text className='text-white' >[link found]</Text>
                        </TouchableOpacity>

               </View>
               {showVideo?<Videoplayer/>:<></>}
        </View>
     
    </View>

  )
}

export default VideoUrls
