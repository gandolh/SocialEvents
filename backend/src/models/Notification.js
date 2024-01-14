
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    msg: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    email: {
        type: String,
        required: true,
    }
});

const notificationDB = mongoose.connection.useDb('IBM');

const Notifications = notificationDB.model('Notifications', notificationSchema);

module.exports = Notifications;