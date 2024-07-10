const mongoose = require("mongoose");

const weatherDataSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  data: {
    main: String,
    description: String,
    temperature: String,
    humidity: String,
    windSpeed: String,
    cloudiness: String,
    visibility: String,
  },
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  locations: [
    {
      locationName: { type: String, required: true },
      weatherData: [weatherDataSchema],
    },
  ],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
