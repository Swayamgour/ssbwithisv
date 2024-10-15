const express = require("express");
const router = express.Router();
const { MagazinePdf } = require("../model/MagazinePdfSchema");
const checkAuth = require("../middlewares/CheckAuth");
const magazineUpload = require("../middlewares/MagazinePdfUpload"); // Updated multer middleware
const fs = require("fs");

// --- Get All Magazine PDFs ---
router.get("/allMagazinePdfs", (req, res) => {
  MagazinePdf.find({}, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

// --- Get a specific Magazine PDF by ID ---
router.get("/magazinePdf/:id", (req, res) => {
  const id = req.params.id;

  MagazinePdf.findById(id, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else if (!data) {
      res.status(404).send({ message: "Magazine PDF not found" });
    } else {
      res.status(200).send(data);
    }
  });
});

// --- POST: Upload a new Magazine PDF and Front Image ---
router.post("/addMagazinePdf", checkAuth, magazineUpload.fields([
  { name: 'magazinePdf', maxCount: 1 },
  { name: 'magazineFrontImage', maxCount: 1 }
]), (req, res) => {
  try {
    const pdfTitle = req.body.pdfTitle;
    const pdfFilePath = req.files['magazinePdf'][0].path; // Path to the uploaded PDF
    const magazineFrontImage = req.files['magazineFrontImage'][0].path; // Path to the uploaded front image

    const newMagazinePdf = new MagazinePdf({
      pdfTitle: pdfTitle,
      pdfFilePath: pdfFilePath,
      magazineFrontImage: magazineFrontImage,
    });

    newMagazinePdf
      .save()
      .then((data) => {
        res.status(201).send({ message: "Successfully uploaded Magazine PDF and image", data });
      })
      .catch((err) => res.status(500).send({ message: err.message }));
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// --- PUT: Update an existing Magazine PDF and Front Image ---
router.put("/updateMagazinePdf/:id", checkAuth, magazineUpload.fields([
  { name: 'magazinePdf', maxCount: 1 },
  { name: 'magazineFrontImage', maxCount: 1 }
]), async (req, res) => {
  const pdfTitle = req.body.pdfTitle;
  const id = req.params.id;

  try {
    // Find the existing document
    const existingPdf = await MagazinePdf.findById(id);
    if (!existingPdf) {
      return res.status(404).send({ message: "Magazine PDF not found" });
    }

    // Delete the old PDF file if a new one is uploaded
    if (req.files['magazinePdf']) {
      const oldPdfPath = existingPdf.pdfFilePath;
      fs.unlink(oldPdfPath, (err) => {
        if (err) {
          console.error("Error deleting old PDF:", err);
        }
      });
      existingPdf.pdfFilePath = req.files['magazinePdf'][0].path; // Update PDF path
    }

    // Delete the old image file if a new one is uploaded
    if (req.files['magazineFrontImage']) {
      const oldImagePath = existingPdf.magazineFrontImage;
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error("Error deleting old image:", err);
        }
      });
      existingPdf.magazineFrontImage = req.files['magazineFrontImage'][0].path; // Update image path
    }

    // Update the title
    existingPdf.pdfTitle = pdfTitle;

    await existingPdf.save();
    res.status(200).send({ message: "Successfully updated the Magazine PDF and image", data: existingPdf });
  } catch (error) {
    res.status(500).send({ message: "An error occurred while updating the PDF and image", error: error.message });
  }
});

// --- DELETE: Remove a Magazine PDF by ID ---
router.delete("/deleteMagazinePdf/:id", checkAuth, async (req, res) => {
  try {
    const id = req.params.id;

    // Find the existing PDF
    const existingPdf = await MagazinePdf.findById(id);
    if (!existingPdf) {
      return res.status(404).send({ message: "Magazine PDF not found" });
    }

    // Delete the PDF file from the server
    const pdfFilePath = existingPdf.pdfFilePath;
    fs.unlink(pdfFilePath, (err) => {
      if (err) {
        console.error("Error deleting PDF file:", err);
      }
    });

    // Delete the front image from the server
    const imageFilePath = existingPdf.magazineFrontImage;
    fs.unlink(imageFilePath, (err) => {
      if (err) {
        console.error("Error deleting image file:", err);
      }
    });

    // Remove the document from the database
    await MagazinePdf.findByIdAndDelete(id);
    res.status(200).send({ message: "Successfully deleted the Magazine PDF and image" });
  } catch (error) {
    res.status(500).send({ message: "An error occurred while deleting the PDF and image", error: error.message });
  }
});

module.exports = router;
