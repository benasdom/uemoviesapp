import { icons } from '@/constants/icons';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import SliderItem from './slideritem';

interface SliderItemProps {
  item: Movie;
  index: number; // <--- Add this line!
}

const Slider = ({movies}) => {
    
    const renderItem = ({ item }:SliderItemProps) => (
  <SliderItem {...item} />
);
    // const [dlist,setdlist]:any = useState([{}]);
  return (
    <View>
        <FlatList 
        horizontal
        pagingEnabled
        data ={movies}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item:Movie)=>item.id+""}
        renderItem={renderItem}
        contentContainerStyle={{gap:25}}
        
        />
        <View>
            <Text style={{fontWeight:"900"}} className='flex flex-row text-3xl text-center h-[50] text-bold item-center text-[white]'>The Running Man</Text>
            <Text className='text-bold text-center text-[whitesmoke] h-[30]'>Movie . Sci-Fi, Adventure</Text>
        </View>
           <View className='flex flex-row items-center pb-[10] justify-around'>
      <View className='flex flex-col items-center justify-center'>
<Image className='w-[25] h-[25]' tintColor="white" source={icons.info}/>
<Text className='text-[whitesmoke]'>Detail</Text>
        </View>
        <TouchableOpacity className='bg-[whitesmoke] w-[200px] h-[60px] rounded-xl justify-center align-center items-center'>
            <Text style={{fontWeight:"600"}} className='text-2xl'>Watch Now</Text></TouchableOpacity>
        <View className='flex flex-col items-center justify-center'>
<Image className='w-[25] h-[25]' tintColor="white" source={icons.calender}/>
<Text className='text-[whitesmoke]'>Add List</Text>
        </View>
      </View>
    </View>
  )
}

export default Slider