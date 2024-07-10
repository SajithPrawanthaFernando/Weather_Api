const axios = require("axios");

const getWeatherData = async (location) => {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

  try {
    const response = await axios.get(url);
    const weather = response.data.weather[0];
    const main = response.data.main;
    const wind = response.data.wind;
    const clouds = response.data.clouds;
    const visibility = response.data.visibility;

    return {
      main: weather.main,
      description: weather.description,
      temperature: main.temp,
      humidity: main.humidity,
      windSpeed: wind.speed,
      cloudiness: clouds.all,
      visibility: visibility,
    };
  } catch (error) {
    throw new Error("Error fetching weather data");
  }
};

module.exports = { getWeatherData };
