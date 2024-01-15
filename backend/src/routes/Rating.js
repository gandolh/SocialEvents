const express = require('express');
const ratingRouter = express.Router();
const ratingController = require('../controllers/Rating');

ratingRouter.get('/', ratingController.getRating);

ratingRouter.post('/doRating/', ratingController.doRating);

ratingRouter.post('/create/', ratingController.createRating);

ratingRouter.delete('/delete/', ratingController.deleteRating);



module.exports = ratingRouter;
