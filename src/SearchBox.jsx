import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import "./SearchBox.css";
import { useState } from "react";

export default function SearchBox({ updateInfo }) {
  let [city, setCity] = useState("");
  let [error, setError] = useState("");

  let getWeatherInfo = async (cityName) => {
    let response = await fetch(
      `/api/weather?city=${encodeURIComponent(cityName)}`,
    );
    let jsonResponse = await response.json();

    if (!response.ok) {
      throw new Error(jsonResponse.error || "Could not get weather information.");
    }

    return {
      city: cityName,
      temp: jsonResponse.main.temp,
      tempMin: jsonResponse.main.temp_min,
      tempMax: jsonResponse.main.temp_max,
      humidity: jsonResponse.main.humidity,
      feelslike: jsonResponse.main.feels_like,
      weather: jsonResponse.weather[0].description,
    };
  };

  let handleChange = (evt) => {
    setCity(evt.target.value);
  };

  let handleSubmit = async (evt) => {
    try {
      evt.preventDefault();
      let searchedCity = city.trim();
      setCity("");
      setError("");
      let newInfo = await getWeatherInfo(searchedCity);
      updateInfo(newInfo);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not get weather information.",
      );
    }
  };

  return (
    <div className="SearchBox">
      <form onSubmit={handleSubmit}>
        <TextField
          id="city"
          label="City Name"
          variant="outlined"
          value={city}
          required
          onChange={handleChange}
        />
        <br></br>
        <br></br>
        <Button variant="contained" type="submit" endIcon={<SendIcon />}>
          Send
        </Button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
