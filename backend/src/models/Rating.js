// type UserRating = {
//     email: string,
//     rating : number
// }

// export type Rating = {
//     _id?: string,
//     ratingID: string,
//     ratings: UserRating[]
// };

const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    ratingID: {
        type: String,
        required: true,
    },
    ratings: {
        type: Array,
        required: true,
    }
});

const ratingDB = mongoose.connection.useDb('IBM');

const Ratings = ratingDB.model('Ratings', ratingSchema);

module.exports = Ratings;

