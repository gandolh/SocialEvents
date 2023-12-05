const express = require('express');
const departmentRouter = express.Router();
const departmentController = require('../controllers/Department');

departmentRouter.post('/', departmentController.getDept);

departmentRouter.get('/all/', departmentController.getAllDept);

departmentRouter.post('/create/', departmentController.createDept);

departmentRouter.put('/update/', departmentController.updateDept);

departmentRouter.delete('/delete/', departmentController.deleteDept);


module.exports = departmentRouter;