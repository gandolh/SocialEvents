const express = require('express');
const eventRouter = express.Router();
const eventController = require('../controllers/Event');

eventRouter.post('/', eventController.getEvent);

eventRouter.get('/all/', eventController.getAllEvents);

eventRouter.post('/create/', eventController.createEvent);

eventRouter.put('/update/', eventController.updateEvent);

eventRouter.delete('/delete/', eventController.deleteEvent);


module.exports = eventRouter;