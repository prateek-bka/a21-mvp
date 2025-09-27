const fs = require("fs");
const csv = require("csv-parser");
const CsvModel = require("../models/CsvModel");

class UploadController {
  // Handle CSV file upload
  static async uploadCSV(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: "No file uploaded",
          message: "Please select a CSV file to upload",
        });
      }

      const filePath = req.file.path;
      const originalName = req.file.originalname;
      const fileName = req.file.filename;
      const fileSize = req.file.size;

      // Parse CSV to validate structure
      const csvData = [];
      let rowCount = 0;
      let headerRow = null;

      fs.createReadStream(filePath)
        .pipe(csv())
        .on("headers", (headers) => {
          headerRow = headers;
        })
        .on("data", (row) => {
          csvData.push(row);
          rowCount++;
        })
        .on("end", () => {
          // CSV successfully parsed and saved
          res.status(200).json({
            message: "CSV file uploaded and saved successfully",
            file: {
              originalName: originalName,
              savedAs: fileName,
              path: filePath,
              size: fileSize,
              rowCount: rowCount,
              headers: headerRow,
            },
            uploadedAt: new Date().toISOString(),
          });
        })
        .on("error", (error) => {
          // Delete the uploaded file if CSV parsing fails
          CsvModel.deleteFile(filePath).catch((unlinkError) => {
            console.error("Error deleting invalid file:", unlinkError);
          });

          res.status(400).json({
            error: "Invalid CSV file",
            message: "The uploaded file could not be parsed as a valid CSV",
            details: error.message,
          });
        });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        error: "Upload failed",
        message: "An error occurred while processing the file upload",
      });
    }
  }

  // Get all uploaded files
  static async getAllUploads(req, res) {
    try {
      const fileDetails = await CsvModel.getAllUploadedFiles();

      res.json({
        message: "Uploaded CSV files retrieved successfully",
        files: fileDetails,
        count: fileDetails.length,
      });
    } catch (error) {
      console.error("Error listing files:", error);
      res.status(500).json({
        error: "Failed to list files",
        message: "An error occurred while retrieving the file list",
      });
    }
  }
}

module.exports = UploadController;
