const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const User = require("./model/User");
const { getWeatherData } = require("./services/weatherservice");
const { sendHourlyReports } = require("./Report/hourWeatherReport");

dotenv.config();

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// sendHourlyReports();

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (authHeader !== "mysecrettoken") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
};

app.get("/", (req, res) => {
  res.write("<h1>WEATHER API<h1>");
  res.write("<h2>Instructions :<h2>");
  res.write("<h2>Authentication key : authorization");
  res.write("<h2>Authentication value : mysecrettoken");

  res.write(
    "<h2>To add users with Email and Location : http://localhost:3000/user<h2>"
  );
  res.write(
    "<h2>To update users Location : http://localhost:3000/user/:email<h2>"
  );
  res.write(
    "<h2>To get users previous weather data by giving a date : http://localhost:3000/user/:email/weather/:date<h2>"
  );
  res.send();
});

app.post("/user", authenticate, async (req, res) => {
  const { email, location } = req.body;

  if (!email || !location) {
    return res.status(400).json({ error: "Email and location are required" });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    const weatherData = await getWeatherData(location);

    const user = new User({
      email,
      locations: [
        { locationName: location, weatherData: [{ data: weatherData }] },
      ],
    });

    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/user/:email", authenticate, async (req, res) => {
  const { email } = req.params;
  const { location } = req.body;

  if (email !== req.body.email) {
    return res.status(400).json({ error: "enter same email" });
  }

  if (!location) {
    return res.status(400).json({ error: "Location is required" });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const weatherData = await getWeatherData(location);

    user.locations.push({
      locationName: location,
      weatherData: {
        data: weatherData,
        date: new Date(),
      },
    });

    user = await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/user/:email/weather/:date", authenticate, async (req, res) => {
  const { email, date } = req.params;

  if (email !== req.body.email) {
    return res.status(400).json({ error: "enter same email" });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (date !== req.body.date) {
    return res.status(400).json({ error: "enter same date" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const requestedDate = new Date(date);

    let weatherData = [];

    user.locations.forEach((location) => {
      const filteredData = location.weatherData.filter(
        (data) =>
          new Date(data.date).toDateString() === requestedDate.toDateString()
      );
      weatherData = weatherData.concat(filteredData);
    });

    if (weatherData.length === 0) {
      return res
        .status(404)
        .json({ error: "Weather data for the requested date does not exist" });
    }

    res.status(200).json(weatherData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

module.exports = app;
