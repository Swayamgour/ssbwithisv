const express = require("express");
const mongoose = require("mongoose");

// Helper function to format time
const getCurrentTime = () => {
  const date = new Date();
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

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
    default: getCurrentTime,  // Automatically sets the current time
  },
});

const Lead = mongoose.model("Lead", leadSchema);

module.exports = {
  Lead,
};
