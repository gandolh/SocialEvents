import { Event } from '@/types/Event';
import axios from 'axios';
import { getAllUsers, getOneUser } from './UsersApiCalls';
import { Notification } from '@/types/Notification';
const addNotification = "/User/update/notifications/"

axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;


const addNotifications = async (event : Event) => {
    getAllUsers().then((res) => {
        const attendeesEmails = event.attendees.map((attendee) => attendee.email);
        const users = res.users.filter((user) => attendeesEmails.includes(user.email));
        const creationDate = new Date();
        users.forEach((user) => {
            const notifs = user.notifications ?? [];
            console.log(user);
                notifs.push({
                msg: `Ai fost invitat la evenimentul ${event.name}  `,
                date: creationDate,
            } as Notification)
            axios.put(addNotification, {
                email: user.email,
                notifs: notifs
            })
        })
    })
}


const getNotifications = async (email : string) => {
    const data = await getOneUser(email);
    console.log(data);
    if(data.err)return { err: data.err};
    const notifs = data.user.notifications as Notification[];
    return { notifications : notifs};
}




export { addNotifications, getNotifications }