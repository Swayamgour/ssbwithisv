const express = require("express");
const router = express.Router();
const axios = require('axios');

const MSG91_AUTHKEY = process.env.MSG91_AUTHKEY;
const VERIFY_ACCESS_TOKEN_URL = process.env.VERIFY_ACCESS_TOKEN_URL;

// Route: Verifying access token from the OTP widget
router.post('/verifyOtpWithAccessToken', async (req, res) => {
    const { accessToken } = req.body;

    // Validate access token presence
    if (!accessToken) {
        return res.status(400).json({ error: 'Access token is required' });
    }

    try {
        // API request to MSG91 to verify the access token
        const response = await axios.post(VERIFY_ACCESS_TOKEN_URL, {
            authkey: MSG91_AUTHKEY,
            'access-token': accessToken
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Check if the token verification was successful
        if (response.data && response.data.type === 'success') {
            return res.json({ message: 'OTP verified successfully', data: response.data });
        } else {
            console.log("Response: ", response.data);
            return res.status(400).json({ message: 'OTP verification failed', data: response.data });
        }

    } catch (error) {
        // Detailed error handling
        console.error('Error during OTP verification:', error);
        return res.status(500).json({ error: 'An error occurred during OTP verification', details: error.message });
    }
});

module.exports = router;
