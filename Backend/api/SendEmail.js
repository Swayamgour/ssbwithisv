const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// POST route to handle sending email
router.post("/send-email", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Create a transporter using Nodemailer (example with Gmail)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your-email@gmail.com',  // Replace with your email
                pass: 'your-email-password'   // Replace with your email password or App Password
            }
        });

        // Define the mail options
        const mailOptions = {
            from: email,  // Sender's email
            to: 'info@ssbwithisv.in',  // Your recipient email
            subject: subject,  // Subject from form
            text: `You have received a new message from ${name} (${email}):\n\n${message}`
        };

        // Send the email using Nodemailer
        await transporter.sendMail(mailOptions);

        // If email is successfully sent, send a success response
        res.status(200).json({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);

        // If there is an error, send a failure response
        res.status(500).json({ success: false, message: 'Failed to send email', error: error.message });
    }
});

module.exports = router;
