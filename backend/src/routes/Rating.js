const express = require('express');
const ratingRouter = express.Router();
const ratingController = require('../controllers/Rating');

ratingRouter.post('/', ratingController.getRating);

ratingRouter.get('/all/', ratingController.getAllRatings);

ratingRouter.post('/create/', ratingController.addRating);

ratingRouter.put('/update/', ratingController.updateRating);

ratingRouter.delete('/delete/', ratingController.deleteRating);



module.exports = ratingRouter;