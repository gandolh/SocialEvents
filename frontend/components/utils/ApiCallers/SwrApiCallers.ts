import { ApiPaths } from './ApiPaths';
import type { Department } from '@/types/Department';
import axios from 'axios';
import useSWR from 'swr'

axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
const fetcher = url => axios.get(url).then(res => res.data)

const UseDepartments = () => {
    const { data, error, isLoading } = useSWR(ApiPaths.department.getAll, fetcher, {fallbackData: {depts: []}});
    const new_depts = data.depts.sort((a, b) => a.name.localeCompare(b.name));
    return {
        allDepts: new_depts as Department[],
        isLoading,
        isError: error
    }
};



const useEvents = () => {
    const { data, error, isLoading } = useSWR(ApiPaths.event.getAll, fetcher, { fallbackData: {events:[]}  })
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

