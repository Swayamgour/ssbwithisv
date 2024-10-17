require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan"); // For logging
const numberMonitor = require("./api/NumberMonitor");
const magazinePdf = require("./api/MagazinePdf");
const loginUsers = require("./api/Login");
const sendOtp = require("./api/SendOtp");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");

const app = express();

// Middlewares
app.use(morgan("dev")); // Log incoming requests
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.CLIENT_URL, // Set your frontend URL
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "token", "authorization"],
    credentials: true,
}));

// Middleware: Connecting different Routes
app.use("/api", sendOtp);
app.use("/api", numberMonitor);
app.use("/api", magazinePdf);
app.use("/api", loginUsers);
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.get("/", (req, res) => {
    res.status(200).send("Welcome to the API");
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).send({ message: err.message || "An internal server error occurred" });
});

// Connect to the Database
connectDB();

// Listen to the PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
    if (err) {
        console.error("Error starting server:", err);
    } else {
        console.log(`Server running at port ${PORT}`);
    }
});
