const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { uploadsDir } = require("../config/multer");

class CsvModel {
  // Helper function to parse CSV file and return data
  static parseCSVFile(filePath) {
    return new Promise((resolve, reject) => {
      const csvData = [];
      let headers = null;

      fs.createReadStream(filePath)
        .pipe(csv())
        .on("headers", (headerRow) => {
          headers = headerRow;
        })
        .on("data", (row) => {
          csvData.push(row);
        })
        .on("end", () => {
          resolve({ data: csvData, headers });
        })
        .on("error", (error) => {
          reject(error);
        });
    });
  }

  // Helper function to get the latest uploaded CSV file
  static getLatestCSVFile() {
    try {
      const files = fs.readdirSync(uploadsDir);
      const csvFiles = files.filter(
        (file) => path.extname(file).toLowerCase() === ".csv",
      );

      if (csvFiles.length === 0) {
        return null;
      }

      // Sort by modification time (newest first)
      const sortedFiles = csvFiles
        .map((file) => {
          const filePath = path.join(uploadsDir, file);
          const stats = fs.statSync(filePath);
          return { file, path: filePath, mtime: stats.mtime };
        })
        .sort((a, b) => b.mtime - a.mtime);

      return sortedFiles[0].path;
    } catch (error) {
      console.error("Error getting latest CSV file:", error);
      return null;
    }
  }

  // Get all uploaded CSV files
  static getAllUploadedFiles() {
    return new Promise((resolve, reject) => {
      fs.readdir(uploadsDir, (err, files) => {
        if (err) {
          return reject(err);
        }

        const csvFiles = files.filter(
          (file) => path.extname(file).toLowerCase() === ".csv",
        );

        const fileDetails = csvFiles.map((file) => {
          const filePath = path.join(uploadsDir, file);
          const stats = fs.statSync(filePath);
          return {
            filename: file,
            size: stats.size,
            uploadedAt: stats.birthtime,
            modifiedAt: stats.mtime,
          };
        });

        resolve(fileDetails);
      });
    });
  }

  // Check if file exists
  static fileExists(filename) {
    const filePath = path.join(uploadsDir, filename);
    return fs.existsSync(filePath);
  }

  // Get file path
  static getFilePath(filename) {
    return path.join(uploadsDir, filename);
  }

  // Delete uploaded file
  static deleteFile(filePath) {
    return new Promise((resolve, reject) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = CsvModel;
