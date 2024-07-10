// const express = require("express");
// const User = require("../model/User");

// const router = express.Router();

// router.post("/user", async (req, res) => {
//   const { email, location } = req.body;
//   try {
//     const user = new User({ email, location });
//     await user.save();
//     res.status(201).json(user);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// router.put("/user/:email", async (req, res) => {
//   const { email } = req.params;
//   const { location } = req.body;
//   try {
//     const user = await User.findOneAndUpdate(
//       { email },
//       { location },
//       { new: true }
//     );
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// router.get("/user/:email/weather", async (req, res) => {
//   const { email } = req.params;
//   const { date } = req.query;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     const weatherData = user.weatherData.filter(
//       (data) =>
//         new Date(data.date).toDateString() === new Date(date).toDateString()
//     );
//     res.status(200).json(weatherData);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// module.exports = router;
