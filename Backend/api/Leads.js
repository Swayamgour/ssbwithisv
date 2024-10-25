const express = require("express");
const router = express.Router();
const { Lead } = require("../model/LeadDetails");

// Get all Lead entries
router.get("/allLeads", (req, res) => {
  Lead.find({}, (err, data) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send(data);
  });
});

// Add a new Lead entry
router.post("/addLead",(req, res) => {
  try {
    const leadData = req.body;
    const newLead = new Lead({
      name: leadData.name,
      email: leadData.email,
      phoneNumber: leadData.phoneNumber,
      // date and time will be automatically added with default values
    });

    newLead
      .save()
      .then((data) => {
        Lead.find({}, (err, data) => {
          if (err) {
            return res.status(500).send(err);
          }
          res.status(201).send({ message: "Successfully created a new lead", data: data });
        });
      })
      .catch((err) => res.status(500).send({ message: err.message }));
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.get("/checkPhoneNumber/:phoneNumber", (req, res) => {
    const phoneNumber = req.params.phoneNumber;
  
    Lead.findOne({ phoneNumber: phoneNumber }, (err, lead) => {
      if (err) {
        return res.status(500).send({ message: "Server error" });
      }
      if (lead) {
        return res.status(200).send({ exists: true, message: "Phone number already exists" });
      } else {
        return res.status(200).send({ exists: false, message: "Phone number is available" });
      }
    });
  });

module.exports = router;
