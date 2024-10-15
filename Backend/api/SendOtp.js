const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

// Fast2SMS API Key (use env variable for security)
const FAST2SMS_API_KEY = process.env.FAST2SMS_API_KEY;

// sendOtp.js

router.post("/send-otp", async (req, res) => {
    const { phoneNumber } = req.body;

    // Log the incoming request to debug
    console.log("Received phone number:", phoneNumber);

    if (!phoneNumber || phoneNumber.length !== 10) {
        return res.status(400).json({ success: false, message: "Invalid phone number" });
    }

    // Generate a 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000);
    console.log("Generated OTP:", generatedOtp);  // Log generated OTP for debugging

    const options = {
        method: "POST",
        headers: {
            authorization: FAST2SMS_API_KEY,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            route: "otp",
            variables_values: generatedOtp,
            numbers: phoneNumber,
        }),
    };

    try {
        const response = await fetch("https://www.fast2sms.com/dev/bulkV2", options);
        const data = await response.json();
        console.log("data= ",data);
        if (data.return) {
            res.json({ success: true, message: "OTP sent successfully" });
        } else {
            res.status(400).json({ success: false, message: "Failed to send OTP" });
        }
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


module.exports = router;
