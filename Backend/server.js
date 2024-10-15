require("dotenv").config();
const express = require("express");
const cors = require("cors");
const numberMonitor = require("./api/NumberMonitor");
const magzinePdf = require("./api/MagazinePdf");
const loginUsers = require("./api/Login");
const sendOtp=require('./api/SendOtp')
const { connectDB } = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");

//Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "token", "authorization"],
    credentials: true,
  })
);

//Middlewares: Connecting different Routes
app.use("/api", sendOtp);
app.use("/api", numberMonitor);
app.use("/api", magzinePdf);
app.use("/api", loginUsers);
app.get("/", (req, res) => {
  res.status(200).send("Welcome to the API");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "An internal server error occurred" });
});


//Connect to the DataBase
connectDB();

//Listen to the PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("server running at port 5000");
  }
});
