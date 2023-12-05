import { ApiPaths } from './ApiPaths';
import axios from 'axios';
import { SocialEventsUser } from '@/types/SocialEventsUser';
import { Event } from '@/types/Event';
import { Notification } from '@/types/Notification';

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

const getRating = async (ratingID : string) => {
    try {
       const data =  (await axios.post(ApiPaths.rating.getOnePath, { id: ratingID })).data;
        return { rating: data.rating }
    } catch (err) {
        return { error: (err) }
    }
};


// ratingID - Id-ul userului sau event-ului
// ratingDict - dictionar de forma {Email1: nota1, Email2: nota2, ...}
const addRating = async (ratingID: string, ratingDict) => {
    try {
        await axios.post(ApiPaths.rating.addRatingPath, { id: ratingID, ratingDict: ratingDict })
        return { error: null }
    } catch (err) {
        return { error: (err) }
    }
}


// ratingID - Id-ul userului sau event-ului
// ratingDict - dictionar de forma {Email1: nota1, Email2: nota2, ...}
const updateRating = async (ratingID, ratingDict) => {
    try {
        await axios.put(ApiPaths.rating.updateRatingPath, { id: ratingID, ratingDict: ratingDict })
        return { error: null }
    } catch (err) {
        return { error: (err) }
    }
}

// ratingID - Id-ul userului sau event-ului
const removeRating = async (ratingID) => {
    try {
        await axios.delete(ApiPaths.rating.deleteRatingPath, { data: { id: ratingID  } })
        return { error: null }
    } catch (err) {
        return { error: (err) }
    }
}


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

