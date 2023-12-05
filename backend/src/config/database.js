require('dotenv').config();
const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

mongoose.connect(`mongodb+srv://${process.env.dbusr}:${process.env.dbpwd}@${process.env.dburl}`);

const database = mongoose.connection;

database.on('error', console.error.bind(console, 'connection error:'));
database.once('open', function () {
  console.log('Connected to MongoDB');
});

module.exports = database;
  