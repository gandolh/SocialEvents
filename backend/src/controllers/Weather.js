const baseUrl = 'http://api.weatherstack.com/current';

let cachedWeather = [
];

exports.getWeather = async (req, res) => {

    cachedWeather = cachedWeather.filter(weather => {
        return weather.timestamp + 1000 * 60 * 60 * 24 > Date.now();
    });
    
    const weather = cachedWeather.find(weather => weather.lat === req.query.lat && weather.lon === req.query.lon);
    if(weather!== undefined && weather !== null) {
        res.status(200).send(weather.resultData);
        return;
    }
    // req.body.forecast_days = 0;
    const params = new URLSearchParams({
        access_key: process.env.WEATHER_API_KEY,
        query: `${req.query.lat},${req.query.lon}`,
        // forecast_days: req.body.forecast_days
    });

    const url = `${baseUrl}?${params.toString()}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const resultData = {
            description: data.current.weather_descriptions[0],
            icon: data.current.weather_icons[0]
        };
        res.status(200).send(resultData);
        cachedWeather.push({
            lat: req.query.lat,
            lon: req.query.lon,
            timestamp: Date.now(),
            resultData: resultData
        });

    } catch (error) {
        res.status(500).send('Error fetching weather data:', error.message);
    }
};
