const express = require('express');
const notificationRouter = express.Router();
const notificationController = require('../controllers/Notification');

notificationRouter.get('/all/', notificationController.getAllNotifications);

notificationRouter.post('/create/', notificationController.createNotification);

notificationRouter.put('/update/', notificationController.updateNotification);

notificationRouter.delete('/delete/', notificationController.deleteNotification);


module.exports = notificationRouter;
