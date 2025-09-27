const express = require("express");
const { upload } = require("../config/multer");
const UploadController = require("../controllers/uploadController");

const router = express.Router();

// CSV upload endpoint
router.post("/upload", upload.single("file"), UploadController.uploadCSV);

// Get all uploaded files
router.get("/all-uploads", UploadController.getAllUploads);

module.exports = router;
