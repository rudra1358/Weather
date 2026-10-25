import SearchBox from "./SearchBox";
import InfoBox from "./InfoBox";
import { useState } from "react";


export default function WeatherApp(){
    const [weatherInfo,setWeatherInfo] = useState({
    city: "Delhi",
    feelslike: 30.36,
    humidity: 35,
    temp: 31.09,
    tempMax: 31.09,
    tempMin: 31.09,
    weather: "clear sky",
  });

  let updateInfo = (newInfo) =>{
    setWeatherInfo(newInfo);
  }

    return(
        <div style={{textAlign: 'center'}}>
            <h2>Weather App By Rudra</h2>
            <SearchBox updateInfo={updateInfo}/>
            <InfoBox info={weatherInfo} />
        </div>
    )
}