const baseUrl = 'https://api.openweathermap.org/data/3.0/onecall';

const cachedWeather = [
    {location: 'Manila', weather: 'sunny'}
];

exports.getWeather = async (req, res) => {
    req.body.lat = 39.791000;
    req.body.lon = -86.148003;
    req.body.date = new Date();
    // console.log(process.env.WEATHER_API_KEY);
    const params = new URLSearchParams({
        lat: req.body.lat,
        lon: req.body.lon,
        exclude: 'minutely,hourly', // Exclude unnecessary details
        appid: process.env.WEATHER_API_KEY,
    });

    const url = `${baseUrl}?${params.toString()}`;
    console.log(url);
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Find the forecast for the specific date in the daily array
        const forecastForDate = data.daily.find((day) => {
            const dayTimestamp = day.dt * 1000; // Convert seconds to milliseconds
            return new Date(dayTimestamp).toDateString() === date.toDateString();
        });

        if (forecastForDate) {
            // Extract weather information for the specific date
            // Example: You can use forecastForDate.weather[0].main

            // Handle the data based on your needs
            res.status(200).json({
                status: 'OK',
                message:  forecastForDate
              });
        } else {
            res.status(500).json({
                status: 'ERR',
                message:  'No forecast available for the specified date.'
              });
        }
        
    } catch (error) {
        res.status(500).json({
            status: 'ERR',
            message:  'Error fetching weather data:' + error.message
          });
    }
};
