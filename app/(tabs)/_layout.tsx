import { icons } from '@/constants/icons'
import { Tabs } from 'expo-router'
import React from 'react'
import { Image, Text, View } from 'react-native'


const TabIcon = ({focused, icon, title}:any)=>{
    return (
        <>
        <View 
        className={focused?
        'flex flex-col items-center justify-center bg-secondary w-[50] h-[20] rounded-full':
        'flex flex-col items-center justify-center w-[70] h-[30] rounded-full'}>
            <Image className='size-6' tintColor={focused?"white":"#c6daffbe"} source={icon}/>
            {focused?<Text className='text-[white] text-sm mt-[5px]'>{title}</Text>:<></>}
        </View>
     
        </>
    )
}

const _layout = () => {
  return (
  <Tabs 
  screenOptions={{
    tabBarShowLabel:false,
    tabBarItemStyle:{
        marginTop:20,
    },
    tabBarStyle:{
        position:"absolute",
        backgroundColor:"rgba(21, 21, 21)",
        height:120,
        borderTopWidth:0

    }
  }}
  >
    <Tabs.Screen
    name="index"
    options={{
        title:"Home",
        headerShown:false,
        tabBarIcon:({focused})=>{
             return (<TabIcon 
                focused={focused}
                title={"Home"}
                icon={icons.home} />)
        }
    }}
    />
  
    <Tabs.Screen
    name="search"
    options={{
        title:"Search",
     headerShown:false,
        tabBarIcon:({focused})=>{
             return (<TabIcon 
                focused={focused}
                title={"Search"}
                icon={icons.search} />)
        }
    }}
    />
    <Tabs.Screen
    name="saved"
    options={{
        title:"Saved",
     headerShown:false,
        tabBarIcon:({focused})=>{
             return (<TabIcon 
                focused={focused}
                title={"Saved"}
                icon={icons.heart} />)
        }
    }}
    />
    <Tabs.Screen
    name="profile"
    options={{
        title:"Profile",
     headerShown:false,
        tabBarIcon:({focused})=>{
             return (<TabIcon 
                focused={focused}
                title={"profile"}
                icon={icons.person} />)
        }
    }}
    />
  </Tabs>
  )
}

export default _layout