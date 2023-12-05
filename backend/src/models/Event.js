const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    host: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        require: true,
    },
    description: {
        type: String,
        required: false,
    },
    attendees: {
        type: Array,
        required: false,
    },
    location: {
        type: Array,
        required: true,
    },
    category: {
        type: String,
        required: true,
        default: 'Other',
    }
});

const eventDB = mongoose.connection.useDb('IBM');

const Events = eventDB.model('Events', eventSchema);

module.exports = Events;