const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    ratingID: {
        type: String,
        required: true,
    },
    ratingDict: {
        type: Object,
        default: {}
    },
    rating: {
        type: Number,
        default: 0
    }
});

const ratingDB = mongoose.connection.useDb('IBM');

const Ratings = ratingDB.model('Ratings', ratingSchema);

module.exports = Ratings;
