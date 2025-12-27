import MovieCard from '@/components/moviecard'
import SearchComponent from '@/components/searchcomponent'
import { fetchMovies } from '@/services/api'
import useFetch from '@/services/useFetch'
import { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Text, View } from 'react-native'

const Search = () => {
const [searchQuery,setSearchQuery] = useState('');
    const {
  data:movies,
    loading,
    refetch: loadMovies,
    reset,
    error    } = useFetch(()=>fetchMovies({
        query:searchQuery
    }),false)

    useEffect(() => {
   const timeoutId=setTimeout(async()=>{
    if(searchQuery.trim()){
    await loadMovies();
   }
   else{
    reset()
   }
   }, 500)
   return ()=>clearTimeout(timeoutId);
    }, [searchQuery])
    
  return (
    <View className='flex flex-col w-full h-full bg-darkAccent'>
        <SearchComponent
         placeholder="Search movies ..."
         value = {searchQuery} 
         onChangeText = {(text:string)=>setSearchQuery(text)}

         />
         <View className='flex' style={{padding:10,paddingLeft:20}}>

          {loading &&
                <ActivityIndicator size="large"/>}
                {error && (
                    <Text className='text-red-500 px-5 my-3'>
                        Error {error.message}
                    </Text>
                )}
                {!loading && !error && searchQuery.trim() && movies?.length >0 && 
                (

                 <View>
                    <Text className='flex items-center justify-center text-[white] '>Search results for{':  '}
                    <Text className='flex items-center justify-center text-[brown] font-heading'>{searchQuery}</Text>
                    </Text>
                 </View>
                )}
         </View>

             <FlatList
              data={movies}
              numColumns={3}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(dataItem, index) => dataItem + index}
              contentContainerClassName='flex items-center'
              renderItem={({ item: dataItem }) => (
                <MovieCard {...dataItem}/>
                
          
              )}
              contentContainerStyle={{ paddingHorizontal: 5 ,gap:10}}
            ListEmptyComponent={
                !loading && !error ?(
                    <View className='mt-10 px-5'>
                        <Text className='text-center text-gray-500'>
                            {searchQuery.trim()?'No movies found':'Search for a movie'}
                        </Text>
                    </View>
                ):null
            }
            />
      <View className="flex w-full bg-darkAccent h-[120px]" />

     
    </View>
  )
}

export default Search