const express = require("express");
const DataController = require("../controllers/dataController");

const router = express.Router();

// Query CSV data endpoint
router.post("/query", DataController.queryData);

// Get CSV data summary/statistics
router.get("/data-summary", DataController.getDataSummary);

module.exports = router;
