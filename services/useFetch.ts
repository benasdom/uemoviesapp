import { useEffect, useState } from "react";
const useFetch = <T>(fetchFunction: ()=>Promise<T>,autoFetch=true)=>{
    const [data,setData] = useState<T | null>(null);
    const [loading,setloading] = useState(false);
    const [error,setError] = useState<Error | null>(null);
    const fetchData = async ()=>{
        try{
                setloading(true);
                setError(null)
                const results = await fetchFunction();
                setData(results);
        }catch(err){
            //@ts-ignore
            setError(err instanceof
                 Error ? err: new Error ("An error occured")
            )
        }
        finally{
            setloading(false);
        }
    }
    const reset = ()=>{
        setData(null)
        setloading(false)
        setError(null)
    }
    useEffect(()=>{
        if(autoFetch){
            fetchData();
        }
    },[])
    return {data,loading,error, refetch:fetchData, reset}
}
export default useFetch;