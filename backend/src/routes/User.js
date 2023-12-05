const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/User');

userRouter.post('/', userController.getUser);

userRouter.post('/login/', userController.loginUser);

userRouter.get('/all/', userController.getAllUsers);

userRouter.post('/dept/', userController.getUserDept);

userRouter.post('/create/', userController.createUser);

userRouter.put('/update/', userController.updateUser);

userRouter.put('/update/dept/', userController.updateUserDept);

userRouter.put('/update/name/', userController.updateUserName);

userRouter.delete('/delete/', userController.deleteUser);

userRouter.put('/update/notifications/', userController.updateUserNotifications);


module.exports = userRouter;
