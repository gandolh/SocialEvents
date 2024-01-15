import { ApiPaths } from './ApiPaths';
import axios from 'axios';
import { SocialEventsUser } from '@/types/SocialEventsUser';
import { Event } from '@/types/Event';
import { Notification } from '@/types/Notification';
import { Rating } from '@/types/Rating';

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

const createEvent = (event : Event) => {

    for (let i = 0; i < event.attendees.length; i++) {
        createNotification(event.attendees[i].email, `Ai fost invitat la evenimentul ${event.name} de catre ${event.host}`);
    }    

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

const createNotification = async (email : string, msg : string) => {
    try {
        const currentDate = new Date();
        await axios.post(ApiPaths.notification.addNotification, { email, msg, date: currentDate})
    } catch (err) {
        return { error: (err) }
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

type result = {
    ratings?: Rating,
    error?: string
}
const getRating = async (ratingId) => {
    try {
        let res = await axios.get(ApiPaths.rating.getRatings + `?ratingId=${ratingId}`)
        return { rating: res.data.rating }
    } catch (err) {
        return { error: (err) }
    }
}

const doRating = async (ratingId, email, rating) => {
    try {
        await axios.post(ApiPaths.rating.doRating, { ratingId, email, rating })
        return { error: null }
    }
    catch (err) {
        console.log(err)
        return { error: err }
    }
}

const createRating = async (ratingId) => {
    try {
        await axios.post(ApiPaths.rating.createRating, { ratingId })
        return { error: null }
    }
    catch (err) {
        return { error: err }
    }
}


const deleteRating = async (ratingId, email) => {
    try {
        await axios.delete(ApiPaths.rating.deleteRating, { data: { ratingId, email } })
        return { error: null }
    }
    catch (err) {
        return { error: err }
    }
}



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
    UpdateUsername,
    getRating,
    doRating,
    deleteRating,
    createRating
}