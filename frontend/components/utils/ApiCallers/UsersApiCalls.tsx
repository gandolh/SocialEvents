import { SocialEventsUser } from '@/types/SocialEventsUser';
import axios from 'axios';
axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
import useSWR from 'swr'
import { ApiPaths } from './ApiPaths';

const fetcher = url => axios.get(url).then(res => res.data)

const HandleChangePassword = async ( email, oldPassword, newPassword) => {
    try {
        await axios.put(ApiPaths.user.updateUser, { email, oldPassword, newPassword })
        return { error: null}
    }
    catch(err){
        return { error: err}
    }
};



const UpdateUsername = async ( name, email) => {
    try{
        await axios.put(ApiPaths.user.updateName, { name, email })
        return { error: null}
    }
    catch(err){
        return { error: err}
    }
};



const useUsers = () => {
    const { data, error, isLoading } = useSWR(ApiPaths.user.getAll, fetcher, {fallbackData: {users: []}})
    return {
        allUsers: data?.users as SocialEventsUser[],
        isLoading,
        isError: error
    }
};

const updateDepartment = async (email, department) => {
    console.log(email, department)
    try{
        await axios.put(ApiPaths.user.updateDept, { email, department })
        return { error: null}
    }
    catch(err){
        return { error: err}
    }
};


const getUsersInDepartment = async (department) => {
    try{
        const res = await axios.post(ApiPaths.user.getUserDept, { department}) as any
        return { error: null , users: res.data.user}
    }
    catch(err){
        return { error: err}
    }
}

const getAllUsers = async () => {
    try{
        let res =  await axios.get(ApiPaths.user.getAll)
        return {users: res.data.users}
    }catch(err){
        return {error: (err)}
    }
}


const getOneUser = async (email) => {
    if( email == "") return {err: "email not found"};
    try{
        let res =  await axios.post(ApiPaths.user.getOne, {email})
        return {user: res.data.user}
    }catch(err){
        return {error: (err)}
    }
}



export { HandleChangePassword, UpdateUsername, useUsers, updateDepartment, getUsersInDepartment,getAllUsers, getOneUser}