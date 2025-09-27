const multer = require("multer");

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Handle multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: "File too large",
        message: "File size exceeds the 10MB limit",
      });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        error: "Unexpected file",
        message: "Unexpected file field or too many files",
      });
    }
    return res.status(400).json({
      error: "Upload error",
      message: err.message,
    });
  }

  // Handle custom file filter errors
  if (err.message === "Only CSV files are allowed!") {
    return res.status(400).json({
      error: "Invalid file type",
      message: "Only CSV files are allowed. Please upload a .csv file.",
    });
  }

  // Generic error handler
  res.status(500).json({
    error: "Something went wrong!",
    message: "An unexpected error occurred on the server",
  });
};

module.exports = errorHandler;
