const express = require("express");
const router = express.Router();
const UserCollection = require("../model/UserDetails");
const UserDetails = UserCollection.UserDetails;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Replace hardcoded admin email/password with environment variables
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail !== email) {
    return res.status(400).json({ error: "Email does not match admin credentials." });
  }

  if (adminPassword === password) {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Use a readable format for expiration time
    });

    return res.status(200).json({ status: "ok", token: token });
  } else {
    return res.status(400).json({ status: "error", error: "Invalid password" });
  }
});

module.exports = router;
