const express = require("express");
const mongoose = require("mongoose");



const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,  // Automatically sets the current date
  },
  time: {
    type: String,
    default: new Date().toLocaleTimeString(), // 11:18:48 AM,  // Automatically sets the current time
  },
});

const Lead = mongoose.model("Lead", leadSchema);

module.exports = {
  Lead,
};
