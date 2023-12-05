import axios from 'axios';
import { ApiPaths } from './ApiPaths';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

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


export { getRating, addRating, updateRating, removeRating }