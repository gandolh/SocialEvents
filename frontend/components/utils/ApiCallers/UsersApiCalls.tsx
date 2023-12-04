import { SocialEventsUser } from '@/types/SocialEventsUser';
import axios from 'axios';
axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
import useSWR from 'swr'
const updateUser = "/User/update/";
const updateName = "/User/update/name/";
const getAll = "/User/all/";
const updateDept = "/User/update/dept/";
const getUserDept = "/User/dept/";
const getOne = "/User/";
const fetcher = url => axios.get(url).then(res => res.data)

const HandleChangePassword = async ( email, oldPassword, newPassword) => {
    try {
        await axios.put(updateUser, { email, oldPassword, newPassword })
        return { error: null}
    }
    catch(err){
        return { error: err}
    }
};



const UpdateUsername = async ( name, email) => {
    try{
        await axios.put(updateName, { name, email })
        return { error: null}
    }
    catch(err){
        return { error: err}
    }
};



const useUsers = () => {
    const { data, error, isLoading } = useSWR(getAll, fetcher, {fallbackData: {users: []}})
    return {
        allUsers: data?.users as SocialEventsUser[],
        isLoading,
        isError: error
    }
};

const updateDepartment = async (email, department) => {
    console.log(email, department)
    try{
        await axios.put(updateDept, { email, department })
        return { error: null}
    }
    catch(err){
        return { error: err}
    }
};


const getUsersInDepartment = async (department) => {
    try{
        const res = await axios.post(getUserDept, { department}) as any
        return { error: null , users: res.data.user}
    }
    catch(err){
        return { error: err}
    }
}

const getAllUsers = async () => {
    try{
        let res =  await axios.get(getAll)
        return {users: res.data.users}
    }catch(err){
        return {error: (err)}
    }
}


const getOneUser = async (email) => {
    if( email == "") return {err: "email not found"};
    try{
        let res =  await axios.post(getOne, {email})
        return {user: res.data.user}
    }catch(err){
        return {error: (err)}
    }
}



export { HandleChangePassword, UpdateUsername, useUsers, updateDepartment, getUsersInDepartment,getAllUsers, getOneUser}