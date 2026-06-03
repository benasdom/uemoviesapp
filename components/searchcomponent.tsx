import React from 'react';
import { TextInput, View } from 'react-native';

interface Props{
    placeholder:string;
    onPress?:()=>void;
    value:string;
    onChangeText:(text:string)=>void;
}
const SearchComponent = ({placeholder,onPress,value,onChangeText}:Props) => {
  return (
  <View className='mt-[50]'>
               <TextInput 
               onPress={onPress}
               placeholder={placeholder}
               value={value}
               keyboardType="default"
               returnKeyType="search"
               onChangeText={onChangeText}
               className=' ml-[20] mr-[20] text-[white] pl-[20px] mr-[20] rounded-xl bg-secondary h-[50]'
               placeholderTextColor={'grey'}
               />

        </View>
  )
}

export default SearchComponent