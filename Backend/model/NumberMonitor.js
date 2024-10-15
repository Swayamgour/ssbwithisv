const express = require("express");
const mongoose = require("mongoose");

const numberMonitorSchema = new mongoose.Schema({
  officerSelection: {
    type: Number,  // Use 'Number' (built-in JavaScript type) instead of Joi's 'number'
    required: true,
  },
  yearService: {
    type: Number,  // Use 'Number' here too
    required: true,
  },
  facultyExperience: {
    type: Number,  // Use 'Number'
    required: true,
  },
  totalFaculty: {
    type: Number,  // Use 'Number'
    required: true,
  },
});

const NumberMonitor = mongoose.model("numberMonitor", numberMonitorSchema);

module.exports = {
  NumberMonitor,
};
