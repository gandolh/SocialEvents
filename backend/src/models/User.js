const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        require: true,
    },
    department: {
        type: String,
        require: false,
        default: 'Guest',
    },
    role: {
        type: String,
        require: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    notifications: {
        type: Object,
        default: {},
        require: false,
    }
});

const userDB = mongoose.connection.useDb('IBM');

const Users = userDB.model('Users', userSchema);

module.exports = Users;