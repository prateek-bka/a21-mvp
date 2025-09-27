const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const multer = require("multer");
const bcrypt = require("bcrypt");
const csv = require("csv-parser");
const path = require("path");
const fs = require("fs");

require("dotenv").config();

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// File filter to only allow CSV files
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "text/csv" ||
    path.extname(file.originalname).toLowerCase() === ".csv"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only CSV files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get("/", (req, res) => {
  res.json({
    message: "Server is running!",
    port: process.env.PORT || 5000,
  });
});

// CSV upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {
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

    // Optional: Parse CSV to validate structure
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
        fs.unlink(filePath, (unlinkError) => {
          if (unlinkError)
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
});

// Helper function to parse CSV file and return data
const parseCSVFile = (filePath) => {
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
};

// Helper function to get the latest uploaded CSV file
const getLatestCSVFile = () => {
  try {
    const files = fs.readdirSync(uploadsDir);
    const csvFiles = files.filter(
      (file) => path.extname(file).toLowerCase() === ".csv"
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
};

// Query CSV data endpoint
app.post("/query", async (req, res) => {
  try {
    // Debug logging
    console.log("Query endpoint called with body:", req.body);

    // Handle cases where req.body is undefined or empty
    const body = req.body || {};

    // Extract and validate parameters with proper defaults
    let { filters, filename, search, limit, offset } = body;

    // Validate and set defaults for pagination parameters
    limit = parseInt(limit) || 100;
    offset = parseInt(offset) || 0;

    // Ensure limit is within reasonable bounds
    if (limit > 1000) limit = 1000;
    if (limit < 1) limit = 1;
    if (offset < 0) offset = 0;

    // Ensure filters is an object if provided
    if (filters && typeof filters !== "object") {
      filters = {};
    }

    // Ensure search is a string if provided
    if (search && typeof search !== "string") {
      search = "";
    }

    // Determine which file to query
    let filePath;
    if (filename) {
      filePath = path.join(uploadsDir, filename);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          error: "File not found",
          message: `The specified file '${filename}' does not exist`,
        });
      }
    } else {
      filePath = getLatestCSVFile();
      if (!filePath) {
        return res.status(404).json({
          error: "No CSV files found",
          message: "Please upload a CSV file first",
        });
      }
    }

    // Parse the CSV file
    const { data, headers } = await parseCSVFile(filePath);

    let filteredData = [...data];

    // Apply filters if provided
    if (filters && typeof filters === "object") {
      filteredData = filteredData.filter((row) => {
        return Object.entries(filters).every(([key, value]) => {
          if (!value || value === "") return true;

          const rowValue = row[key];
          if (!rowValue) return false;

          // Handle different filter types
          if (Array.isArray(value)) {
            // Multiple values (OR condition)
            return value.some((v) =>
              rowValue.toLowerCase().includes(v.toLowerCase())
            );
          } else if (typeof value === "string") {
            // Single value (case-insensitive partial match)
            return rowValue.toLowerCase().includes(value.toLowerCase());
          }

          return rowValue === value;
        });
      });
    }

    // Apply search if provided
    if (search && search.trim() !== "") {
      const searchTerm = search.toLowerCase();
      filteredData = filteredData.filter((row) => {
        return Object.values(row).some(
          (value) =>
            value && value.toString().toLowerCase().includes(searchTerm)
        );
      });
    }

    // Handle special query types
    const { queryType, sortBy, sortOrder = "desc" } = body;

    let responseData = filteredData;
    let analytics = null;

    if (queryType === "top_products") {
      // Get top products by sales amount or units sold
      const metric = body.metric || "SalesAmount"; // 'SalesAmount' or 'UnitsSold'
      const topCount = parseInt(body.topCount) || 5;

      // Group by product and sum the metric
      const productSales = {};
      filteredData.forEach((row) => {
        const product = row.Product;
        const value = parseFloat(row[metric]) || 0;

        if (!productSales[product]) {
          productSales[product] = {
            Product: product,
            Category: row.Category,
            TotalSalesAmount: 0,
            TotalUnitsSold: 0,
            OrderCount: 0,
          };
        }

        productSales[product].TotalSalesAmount +=
          parseFloat(row.SalesAmount) || 0;
        productSales[product].TotalUnitsSold += parseInt(row.UnitsSold) || 0;
        productSales[product].OrderCount += 1;
      });

      // Sort and get top products
      responseData = Object.values(productSales)
        .sort((a, b) => {
          const aValue =
            metric === "SalesAmount" ? a.TotalSalesAmount : a.TotalUnitsSold;
          const bValue =
            metric === "SalesAmount" ? b.TotalSalesAmount : b.TotalUnitsSold;
          return sortOrder === "desc" ? bValue - aValue : aValue - bValue;
        })
        .slice(0, topCount);
    } else if (queryType === "sales_trend") {
      // Group by date/month for sales trend analysis
      const groupBy = body.groupBy || "month"; // 'day', 'month', 'year'
      const salesTrend = {};

      filteredData.forEach((row) => {
        const date = new Date(row.Date.split("-").reverse().join("-")); // Convert DD-MM-YYYY to YYYY-MM-DD
        let key;

        if (groupBy === "month") {
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
            2,
            "0"
          )}`;
        } else if (groupBy === "year") {
          key = date.getFullYear().toString();
        } else {
          key = row.Date;
        }

        if (!salesTrend[key]) {
          salesTrend[key] = {
            Period: key,
            TotalSalesAmount: 0,
            TotalUnitsSold: 0,
            OrderCount: 0,
            AverageSalesAmount: 0,
          };
        }

        salesTrend[key].TotalSalesAmount += parseFloat(row.SalesAmount) || 0;
        salesTrend[key].TotalUnitsSold += parseInt(row.UnitsSold) || 0;
        salesTrend[key].OrderCount += 1;
      });

      // Calculate averages and sort by period
      responseData = Object.values(salesTrend)
        .map((item) => ({
          ...item,
          AverageSalesAmount:
            item.OrderCount > 0 ? item.TotalSalesAmount / item.OrderCount : 0,
        }))
        .sort((a, b) => a.Period.localeCompare(b.Period));
    } else if (queryType === "region_analysis") {
      // Group by region for regional analysis
      const regionStats = {};

      filteredData.forEach((row) => {
        const region = row.Region;

        if (!regionStats[region]) {
          regionStats[region] = {
            Region: region,
            TotalSalesAmount: 0,
            TotalUnitsSold: 0,
            OrderCount: 0,
            AverageSalesAmount: 0,
            TopProducts: {},
          };
        }

        regionStats[region].TotalSalesAmount +=
          parseFloat(row.SalesAmount) || 0;
        regionStats[region].TotalUnitsSold += parseInt(row.UnitsSold) || 0;
        regionStats[region].OrderCount += 1;

        // Track top products per region
        const product = row.Product;
        if (!regionStats[region].TopProducts[product]) {
          regionStats[region].TopProducts[product] = 0;
        }
        regionStats[region].TopProducts[product] +=
          parseFloat(row.SalesAmount) || 0;
      });

      // Calculate averages and get top 3 products per region
      responseData = Object.values(regionStats).map((region) => ({
        ...region,
        AverageSalesAmount:
          region.OrderCount > 0
            ? region.TotalSalesAmount / region.OrderCount
            : 0,
        TopProducts: Object.entries(region.TopProducts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([product, sales]) => ({ Product: product, TotalSales: sales })),
      }));
    }

    // Apply sorting if specified (for regular queries)
    if (!queryType && sortBy) {
      responseData.sort((a, b) => {
        const aValue = parseFloat(a[sortBy]) || a[sortBy] || "";
        const bValue = parseFloat(b[sortBy]) || b[sortBy] || "";

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortOrder === "desc" ? bValue - aValue : aValue - bValue;
        } else {
          const comparison = aValue.toString().localeCompare(bValue.toString());
          return sortOrder === "desc" ? -comparison : comparison;
        }
      });
    }

    // Apply pagination (skip for analytics queries that return aggregated data)
    const total = responseData.length;
    let paginatedData = responseData;

    if (!queryType || queryType === "standard") {
      paginatedData = responseData.slice(offset, offset + limit);
    }

    res.json({
      message: "Query executed successfully",
      data: paginatedData,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
      headers,
      filters: filters || {},
      search: search || "",
      queryType: queryType || "standard",
      analytics,
    });
  } catch (error) {
    console.error("Query error:", error);
    res.status(500).json({
      error: "Query failed",
      message: "An error occurred while querying the CSV data",
      details: error.message,
    });
  }
});

// Get unique values for each column (for filter options) - without filename
app.get("/filter-options", async (req, res) => {
  try {
    // Use the latest uploaded CSV file
    const filePath = getLatestCSVFile();
    if (!filePath) {
      return res.status(404).json({
        error: "No CSV files found",
        message: "Please upload a CSV file first",
      });
    }

    // Parse the CSV file
    const { data, headers } = await parseCSVFile(filePath);

    // Get unique values for each column
    const filterOptions = {};
    headers.forEach((header) => {
      const uniqueValues = [
        ...new Set(
          data
            .map((row) => row[header])
            .filter((value) => value && value.trim() !== "")
        ),
      ].sort();

      filterOptions[header] = uniqueValues;
    });

    res.json({
      message: "Filter options retrieved successfully",
      headers,
      filterOptions,
      totalRows: data.length,
    });
  } catch (error) {
    console.error("Filter options error:", error);
    res.status(500).json({
      error: "Failed to get filter options",
      message: "An error occurred while analyzing the CSV data",
      details: error.message,
    });
  }
});

// Get unique values for each column (for filter options) - with specific filename
app.get("/filter-options/:filename", async (req, res) => {
  try {
    const { filename } = req.params;

    // Use the specified file
    const filePath = path.join(uploadsDir, filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: "File not found",
        message: `The specified file '${filename}' does not exist`,
      });
    }

    // Parse the CSV file
    const { data, headers } = await parseCSVFile(filePath);

    // Get unique values for each column
    const filterOptions = {};
    headers.forEach((header) => {
      const uniqueValues = [
        ...new Set(
          data
            .map((row) => row[header])
            .filter((value) => value && value.trim() !== "")
        ),
      ].sort();

      filterOptions[header] = uniqueValues;
    });

    res.json({
      message: "Filter options retrieved successfully",
      headers,
      filterOptions,
      totalRows: data.length,
    });
  } catch (error) {
    console.error("Filter options error:", error);
    res.status(500).json({
      error: "Failed to get filter options",
      message: "An error occurred while analyzing the CSV data",
      details: error.message,
    });
  }
});

// Get CSV data summary/statistics - without filename
app.get("/data-summary", async (req, res) => {
  try {
    // Use the latest uploaded CSV file
    const filePath = getLatestCSVFile();
    if (!filePath) {
      return res.status(404).json({
        error: "No CSV files found",
        message: "Please upload a CSV file first",
      });
    }

    // Parse the CSV file
    const { data, headers } = await parseCSVFile(filePath);

    // Calculate total sales and units sold
    const totalSales = data.reduce(
      (sum, row) => sum + (parseFloat(row.SalesAmount) || 0),
      0
    );
    const totalUnitsSold = data.reduce(
      (sum, row) => sum + (parseInt(row.UnitsSold) || 0),
      0
    );

    // Calculate sales by region for bar chart (formatted for recharts)
    const regionSales = {};
    data.forEach((row) => {
      const region = row.Region;
      const sales = parseFloat(row.SalesAmount) || 0;
      const units = parseInt(row.UnitsSold) || 0;

      if (!regionSales[region]) {
        regionSales[region] = { region, sales: 0, units: 0, orders: 0 };
      }
      regionSales[region].sales += sales;
      regionSales[region].units += units;
      regionSales[region].orders += 1;
    });

    const salesByRegionChart = Object.values(regionSales)
      .map((region) => ({
        name: region.region,
        sales: Math.round(region.sales * 100) / 100,
        units: region.units,
        orders: region.orders,
      }))
      .sort((a, b) => b.sales - a.sales);

    // Find best performing region
    const bestPerformingRegion = salesByRegionChart[0];

    // Calculate sales by category for donut chart (formatted for recharts)
    const categorySales = {};
    data.forEach((row) => {
      const category = row.Category;
      const sales = parseFloat(row.SalesAmount) || 0;

      if (!categorySales[category]) {
        categorySales[category] = 0;
      }
      categorySales[category] += sales;
    });

    const salesByCategoryChart = Object.entries(categorySales)
      .map(([name, value]) => ({
        name,
        value: Math.round(value * 100) / 100,
        percentage: Math.round((value / totalSales) * 100 * 100) / 100,
      }))
      .sort((a, b) => b.value - a.value);

    // Calculate monthly sales trend (formatted for recharts line chart)
    const monthlySales = {};
    data.forEach((row) => {
      // Convert DD-MM-YYYY to proper date
      const dateParts = row.Date.split("-");
      const date = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const monthName = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      const sales = parseFloat(row.SalesAmount) || 0;
      const units = parseInt(row.UnitsSold) || 0;

      if (!monthlySales[monthKey]) {
        monthlySales[monthKey] = {
          month: monthName,
          sales: 0,
          units: 0,
          orders: 0,
          sortKey: monthKey,
        };
      }
      monthlySales[monthKey].sales += sales;
      monthlySales[monthKey].units += units;
      monthlySales[monthKey].orders += 1;
    });

    const monthlySalesTrendChart = Object.values(monthlySales)
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
      .map((month) => ({
        month: month.month,
        sales: Math.round(month.sales * 100) / 100,
        units: month.units,
        orders: month.orders,
      }));

    // Prepare table data with proper structure for frontend sorting/pagination
    const csvTableData = data.map((row, index) => ({
      id: index + 1,
      ...row,
      SalesAmount: parseFloat(row.SalesAmount) || 0,
      UnitsSold: parseInt(row.UnitsSold) || 0,
    }));

    // Calculate additional metrics
    const averageOrderValue = totalSales / data.length;
    const totalOrders = data.length;

    res.json({
      message: "Data summary generated successfully",
      // Summary metrics for cards
      summary: {
        totalSales: Math.round(totalSales * 100) / 100,
        totalUnitsSold,
        totalOrders,
        averageOrderValue: Math.round(averageOrderValue * 100) / 100,
        bestPerformingRegion: bestPerformingRegion.name,
      },
      // Chart data ready for recharts
      charts: {
        salesByRegion: salesByRegionChart,
        salesByCategory: salesByCategoryChart,
        monthlySalesTrend: monthlySalesTrendChart,
      },
      // Raw CSV data for table display
      csvData: {
        data: csvTableData,
        headers,
        totalRecords: csvTableData.length,
      },
    });
  } catch (error) {
    console.error("Data summary error:", error);
    res.status(500).json({
      error: "Failed to generate data summary",
      message: "An error occurred while analyzing the CSV data",
      details: error.message,
    });
  }
});

// Get CSV data summary/statistics - with specific filename
app.get("/data-summary/:filename", async (req, res) => {
  try {
    const { filename } = req.params;

    // Use the specified file
    const filePath = path.join(uploadsDir, filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: "File not found",
        message: `The specified file '${filename}' does not exist`,
      });
    }

    // Parse the CSV file
    const { data, headers } = await parseCSVFile(filePath);

    // Generate summary statistics
    const summary = {
      totalRows: data.length,
      totalColumns: headers.length,
      headers,
      columnStats: {},
    };

    headers.forEach((header) => {
      const values = data
        .map((row) => row[header])
        .filter((v) => v && v.trim() !== "");
      const uniqueValues = new Set(values);

      summary.columnStats[header] = {
        totalValues: values.length,
        uniqueValues: uniqueValues.size,
        emptyValues: data.length - values.length,
        sampleValues: [...uniqueValues].slice(0, 5), // First 5 unique values as sample
      };
    });

    res.json({
      message: "Data summary generated successfully",
      summary,
    });
  } catch (error) {
    console.error("Data summary error:", error);
    res.status(500).json({
      error: "Failed to generate data summary",
      message: "An error occurred while analyzing the CSV data",
      details: error.message,
    });
  }
});

// Get list of uploaded files
app.get("/all-uploads", (req, res) => {
  try {
    fs.readdir(uploadsDir, (err, files) => {
      if (err) {
        return res.status(500).json({
          error: "Unable to read uploads directory",
          message: err.message,
        });
      }

      const csvFiles = files.filter(
        (file) => path.extname(file).toLowerCase() === ".csv"
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

      res.json({
        message: "Uploaded CSV files retrieved successfully",
        files: fileDetails,
        count: fileDetails.length,
      });
    });
  } catch (error) {
    console.error("Error listing files:", error);
    res.status(500).json({
      error: "Failed to list files",
      message: "An error occurred while retrieving the file list",
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
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
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
