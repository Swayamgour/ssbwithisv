const express = require("express");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  repassword: {
    type: String,
    required: true,
  },
  resetToken:String,
  expireToken:Date,
});

const UserSchema = new mongoose.model("userSchema", userSchema);
module.exports = {
  UserDetails: UserSchema,
};
