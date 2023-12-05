import { Event } from '@/types/Event';
import axios from 'axios';
import { getAllUsers, getOneUser } from './UsersApiCalls';
import { Notification } from '@/types/Notification';
import { ApiPaths } from './ApiPaths';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;






export { addNotifications, getNotifications }