const express = require("express");
const router = express.Router();
const { NumberMonitor } = require("../model/NumberMonitor");
const checkAuth = require("../middlewares/CheckAuth");

// Get all NumberMonitor entries
router.get("/allNumberMonitors", (req, res) => {
  NumberMonitor.find({}, (err, data) => {
    if (err) {
      return res.status(500).send(err);
    } 
    res.status(200).send(data);
  });
});

// Add a new NumberMonitor entry
router.post("/addNumberMonitor", checkAuth, (req, res) => {
  try {
    const numberMonitorData = req.body;
    const newEntry = new NumberMonitor({
      officerSelection: numberMonitorData.officerSelection,
      yearService: numberMonitorData.yearService,
      facultyExperience: numberMonitorData.facultyExperience,
      totalFaculty: numberMonitorData.totalFaculty,
    });

    newEntry
      .save()
      .then((data) => {
        NumberMonitor.find({}, (err, data) => {
          if (err) {
            return res.status(500).send(err);
          } 
          res.status(201).send({ message: "Successfully created a new entry", data: data });
        });
      })
      .catch((err) => res.status(500).send({ message: err.message }));
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Update a specific NumberMonitor entry
router.put("/updateNumberMonitor/:id", checkAuth, (req, res) => {
  const numberMonitorData = req.body;

  NumberMonitor.findOneAndUpdate(
    { _id: req.params.id },
    {
      officerSelection: numberMonitorData.officerSelection,
      yearService: numberMonitorData.yearService,
      facultyExperience: numberMonitorData.facultyExperience,
      totalFaculty: numberMonitorData.totalFaculty,
    },
    { new: true }, // To return the updated document
    (err, data) => {
      if (err) {
        return res.status(500).send(err);
      } 
      res.status(200).send({ message: "Successfully updated the entry", data: data });
    }
  );
});

module.exports = router;
