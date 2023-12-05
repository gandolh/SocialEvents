import { ApiPaths } from './ApiPaths';
import axios from 'axios';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;


const addDepartment = async (deptName) => {
    try{
         await axios.post(ApiPaths.department.addDept, {name: deptName})
         return {error: null}
    }catch(err){
        return {error: (err)}
    }   
}

const removeDepartment = async (deptName) => {
    try{
        await axios.delete(ApiPaths.department.deleteDept,{data : {name: deptName}})
        return {error: null}
    }catch(err){
        return {error: (err)}
    }
}


const  getAllEvents = async () => {
    try{
        let res =  await axios.get(ApiPaths.event.getAll)
        return {allEvents: res.data.events}
   }catch(err){
       return {error: (err)}
   }   
};



const createEvent = (event) => {
    return axios
    .post(ApiPaths.event.create, event)
    .catch((err) => {
      console.log(err)
    })
}

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
            axios.put(ApiPaths.notification.addNotification, {
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
