const Rating = require('../models/Rating');

async function calculateRating(id) {
    try {
        const rating = await Rating.findOne({
            ratingID: id
        }).exec();
        if(rating) {
            rating.rating = 0;
            const obj = rating.ratingDict;
            const values = Object.values(obj);
            values.forEach(element => {
                rating.rating += element;
            });
            rating.rating /= values.length;

            rating.save();
        } else {
            rating.rating = 0;
            rating.save();
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports = {calculateRating};