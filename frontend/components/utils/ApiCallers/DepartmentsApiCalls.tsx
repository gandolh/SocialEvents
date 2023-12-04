import type { Department } from '@/types/Department';
import axios from 'axios';
import useSWR from 'swr'
const getAll = "/Department/all/";
const addDept = "Department/create/"
const deleteDept = "Department/delete/"

const fetcher = url => axios.get(url).then(res => res.data)

const UseDepartments = () => {
    const { data, error, isLoading } = useSWR(getAll, fetcher, {fallbackData: {depts: []}});
    const new_depts = data.depts.sort((a, b) => a.name.localeCompare(b.name));
    return {
        allDepts: new_depts as Department[],
        isLoading,
        isError: error
    }
};


const addDepartment = async (deptName) => {
    try{
         await axios.post(addDept, {name: deptName})
         return {error: null}
    }catch(err){
        return {error: (err)}
    }   
}

const removeDepartment = async (deptName) => {
    try{
        await axios.delete(deleteDept,{data : {name: deptName}})
        return {error: null}
    }catch(err){
        return {error: (err)}
    }
}


export {UseDepartments,addDepartment,removeDepartment}