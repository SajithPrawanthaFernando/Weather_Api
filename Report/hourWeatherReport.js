// require("dotenv").config(); // Ensure you have the 'dotenv' package installed to use environment variables
// const User = require("../model/User");
// const { getWeatherData } = require("../services/weatherservice");
// const { sendWeatherReport } = require("../services/emailService");
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

// const generateWeatherText = async (weatherData, locationName, dateTime) => {
//   const formattedDate = dateTime.toLocaleString();

//   const prompt = `Generate a detailed weather report for ${locationName} with the following weather data:\n\n${JSON.stringify(
//     weatherData,
//     null,
//     2
//   )}.\n\nDate/Time: ${formattedDate}`;

//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//     const result = await model.generateContent(prompt);
//     const response = result.response;
//     const text = response.text();
//     return text.trim();
//   } catch (error) {
//     console.error(`Error generating weather text: ${error.message}`);
//     return "Unable to generate detailed weather report.";
//   }
// };

// const sendHourlyReports = async () => {
//   try {
//     const currentDate = new Date();

//     const users = await User.find();
//     console.log(`Found ${users.length} users`);

//     for (const user of users) {
//       try {
//         console.log(`Processing user: ${user.email}`);

//         if (!user.locations || user.locations.length === 0) {
//           console.log(`User ${user.email} does not have locations`);
//           continue;
//         }

//         let mostRecentLocation = null;
//         let mostRecentWeatherData = { date: new Date(0) };

//         for (const location of user.locations) {
//           const locationRecentWeatherData = location.weatherData.reduce(
//             (latest, entry) => {
//               return new Date(entry.date) > new Date(latest.date)
//                 ? entry
//                 : latest;
//             },
//             { date: new Date(0) }
//           );

//           if (
//             new Date(locationRecentWeatherData.date) >
//             new Date(mostRecentWeatherData.date)
//           ) {
//             mostRecentWeatherData = locationRecentWeatherData;
//             mostRecentLocation = location;
//           }
//         }

//         if (mostRecentLocation) {

//           const weatherData = await getWeatherData(
//             mostRecentLocation.locationName
//           );
//           console.log(
//             `Fetched current weather data for ${mostRecentLocation.locationName}:`,
//             weatherData
//           );

//           const weatherText = await generateWeatherText(
//             weatherData,
//             mostRecentLocation.locationName,
//             mostRecentWeatherData.date
//           );

//           console.log(
//             `Sending weather report for ${mostRecentLocation.locationName} to ${user.email}`
//           );

//           const emailContent = `Detailed Report:\n${weatherText}`;
//           await sendWeatherReport(user.email, "Weather Report", emailContent);

//           mostRecentLocation.weatherData.push({
//             date: currentDate,
//             data: weatherData,
//           });
//           await user.save();
//         } else {
//           console.log(
//             `No recent weather data found for any location for ${user.email}`
//           );
//         }
//       } catch (error) {
//         console.error(`Error processing user ${user.email}: ${error.message}`);
//       }
//     }
//   } catch (error) {
//     console.error(`Error fetching users: ${error.message}`);
//   }
// };

// setInterval(sendHourlyReports, 180 * 60 * 1000);

// module.exports = { sendHourlyReports };
