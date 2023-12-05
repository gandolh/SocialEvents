const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
});

const departmentDB = mongoose.connection.useDb('IBM');

const Departments = departmentDB.model('Departments', departmentSchema);

module.exports = Departments;