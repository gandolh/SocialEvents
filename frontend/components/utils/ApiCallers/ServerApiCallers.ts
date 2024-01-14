import { ApiPaths } from './ApiPaths';
import axios from 'axios';
import { SocialEventsUser } from '@/types/SocialEventsUser';
import { Event } from '@/types/Event';
import { Notification } from '@/types/Notification';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;


const addDepartment = async (deptName) => {
    try {
        await axios.post(ApiPaths.department.addDept, { name: deptName })
        return { error: null }
    } catch (err) {
        return { error: (err) }
    }
}

const removeDepartment = async (deptName) => {
    try {
        await axios.delete(ApiPaths.department.deleteDept, { data: { name: deptName } })
        return { error: null }
    } catch (err) {
        return { error: (err) }
    }
}

const getAllEvents = async () => {
    try {
        let res = await axios.get(ApiPaths.event.getAll)
        return { allEvents: res.data.events }
    } catch (err) {
        return { error: (err) }
    }
};

const createEvent = (event) => {
    return axios
        .post(ApiPaths.event.create, event)
        .catch((err) => {
            console.log(err)
        })
}

type NotificationResponse = {
    notifications: Notification[],
    error?: string
}

const getNotifications = async (email: string) : Promise<NotificationResponse> => {

    try {
        let res = await axios.get(ApiPaths.notification.getAll + "?email=" + email)
        return { notifications: res.data.notifications as Notification[] }
    } catch (err) {
        return { error: (err), notifications: [] }
    }
}

const updateDepartment = async (email, department) => {
    console.log(email, department)
    try {
        await axios.put(ApiPaths.user.updateDept, { email, department })
        return { error: null }
    }
    catch (err) {
        return { error: err }
    }
};

const getUsersInDepartment = async (department) => {
    try {
        const res = await axios.post(ApiPaths.user.getUserDept, { department }) as any
        return { error: null, users: res.data.user }
    }
    catch (err) {
        return { error: err }
    }
}

const getAllUsers = async () => {
    try {
        let res = await axios.get(ApiPaths.user.getAll)
        return { users: res.data.users as SocialEventsUser[] }
    } catch (err) {
        return { error: (err) }
    }
}

const getOneUser = async (email) => {
    if (email == "") return { err: "email not found" };
    try {
        let res = await axios.post(ApiPaths.user.getOne, { email })
        return { user: res.data.user }
    } catch (err) {
        return { error: (err) }
    }
}

const HandleChangePassword = async (email, oldPassword, newPassword) => {
    try {
        await axios.put(ApiPaths.user.updateUser, { email, oldPassword, newPassword })
        return { error: null }
    }
    catch (err) {
        return { error: err }
    }
};

const UpdateUsername = async (name, email) => {
    try {
        await axios.put(ApiPaths.user.updateName, { name, email })
        return { error: null }
    }
    catch (err) {
        return { error: err }
    }
};

export {
    addDepartment,
    removeDepartment,
    getAllEvents,
    createEvent,
    getNotifications,
    updateDepartment,
    getUsersInDepartment,
    getAllUsers,
    getOneUser,
    HandleChangePassword,
    UpdateUsername
}