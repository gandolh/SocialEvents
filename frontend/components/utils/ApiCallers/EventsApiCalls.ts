import axios from 'axios';
import useSWR from 'swr'
import type { Event } from "@/types/Event";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
const fetcher = url => axios.get(url).then(res => res.data)
const getAll = "/Event/all/";
const create = "/Event/create/"


const useEvents = () => {
    const { data, error, isLoading } = useSWR(getAll, fetcher, { fallbackData: {events:[]}  })
    const events = data?.events.map((el) => {
        return {
            ...el,
            date: new Date(el.date)
        }
    });
    return {
        AllEvents: events as Event[],
        isLoading,
        isError: error
    }
};


const  getAllEvents = async () => {
    try{
        let res =  await axios.get(getAll)
        return {allEvents: res.data.events}
   }catch(err){
       return {error: (err)}
   }   
};



const createEvent = (event) => {
    return axios
    .post(create, event)
    .catch((err) => {
      console.log(err)
    })
}





export { useEvents, getAllEvents,createEvent }