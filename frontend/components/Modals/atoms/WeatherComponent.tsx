import { getWeather } from "@/components/utils/ApiCallers/ServerApiCallers";
import React from "react";

const WeatherComponent = ({ lat, lon }) => {

    const [weather, setWeather] = React.useState<string>("");
    const [weatherIcon, setWeatherIcon] = React.useState<string>("");

    React.useEffect(() => {
        getWeather(lat, lon).then((res) => {
            console.log(res);

            setWeather(res.weather.description);
            setWeatherIcon(res.weather.icon);
        }
        );
    }, []);


    return (<>
        <div>current weather:</div>
        <div className="flex gap-2 items-center"> {weather} <img width={32} height={32} src={weatherIcon}/></div>
    </>);
}

export default WeatherComponent;