const express = require('express');
const database = require('./config/database');
const bodyParser = require('body-parser');
const cors = require('cors');

const deptRoutes = require('./routes/Department');
const eventRoutes = require('./routes/Event');
const userRoutes = require('./routes/User');
const notifRoutes = require('./routes/Notification');
const ratingRouter = require('./routes/Rating');
const { getWeather } = require('./controllers/Weather');

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Routes
app.use('/API/User', userRoutes);

app.use('/API/Event', eventRoutes);

app.use('/API/Department', deptRoutes);

app.use('/API/Notification', notifRoutes);
app.use('/API/Rating', ratingRouter);


app.use('/API/1987', (req, res) => {
  res.send({ message: "Is that the bite of '87?!" });
});

app.use('/API/weather', (req, res) => {
  getWeather(req, res);
});

app.use('/', (req, res) => {
  res.status(200).json({ status: 'Running!' });
});


const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});  

