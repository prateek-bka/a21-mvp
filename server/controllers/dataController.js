const CsvModel = require("../models/CsvModel");
const DataAnalyzer = require("../utils/dataAnalyzer");

class DataController {
  // Query CSV data with filters, search, and analytics
  static async queryData(req, res) {
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
        if (!CsvModel.fileExists(filename)) {
          return res.status(404).json({
            error: "File not found",
            message: `The specified file '${filename}' does not exist`,
          });
        }
        filePath = CsvModel.getFilePath(filename);
      } else {
        filePath = CsvModel.getLatestCSVFile();
        if (!filePath) {
          return res.status(404).json({
            error: "No CSV files found",
            message: "Please upload a CSV file first",
          });
        }
      }

      // Parse the CSV file
      const { data, headers } = await CsvModel.parseCSVFile(filePath);

      let filteredData = [...data];

      // Apply filters if provided
      if (filters && typeof filters === "object") {
        filteredData = DataAnalyzer.applyFilters(filteredData, filters);
      }

      // Apply search if provided
      if (search && search.trim() !== "") {
        filteredData = DataAnalyzer.applySearch(filteredData, search);
      }

      // Handle special query types
      const { queryType, sortBy, sortOrder = "desc" } = body;

      let responseData = filteredData;
      let analytics = null;

      if (queryType === "top_products") {
        const metric = body.metric || "SalesAmount";
        const topCount = parseInt(body.topCount) || 5;
        responseData = DataAnalyzer.getTopProducts(
          filteredData,
          metric,
          topCount,
          sortOrder,
        );
      } else if (queryType === "sales_trend") {
        const groupBy = body.groupBy || "month";
        responseData = DataAnalyzer.getSalesTrend(filteredData, groupBy);
      } else if (queryType === "region_analysis") {
        responseData = DataAnalyzer.getRegionAnalysis(filteredData);
      }

      // Apply sorting if specified (for regular queries)
      if (!queryType && sortBy) {
        responseData = DataAnalyzer.sortData(responseData, sortBy, sortOrder);
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
  }

  // Get data summary with analytics
  static async getDataSummary(req, res) {
    try {
      const { filename } = req.params;
      let filePath;

      if (filename) {
        if (!CsvModel.fileExists(filename)) {
          return res.status(404).json({
            error: "File not found",
            message: `The specified file '${filename}' does not exist`,
          });
        }
        filePath = CsvModel.getFilePath(filename);
      } else {
        filePath = CsvModel.getLatestCSVFile();
        if (!filePath) {
          return res.status(404).json({
            error: "No CSV files found",
            message: "Please upload a CSV file first",
          });
        }
      }

      // Parse the CSV file
      const { data, headers } = await CsvModel.parseCSVFile(filePath);

      // Generate comprehensive data summary
      const summary = DataAnalyzer.generateDataSummary(data, headers);

      res.json({
        message: "Data summary generated successfully",
        ...summary,
      });
    } catch (error) {
      console.error("Data summary error:", error);
      res.status(500).json({
        error: "Failed to generate data summary",
        message: "An error occurred while analyzing the CSV data",
        details: error.message,
      });
    }
  }
}

module.exports = DataController;
