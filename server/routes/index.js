const express = require("express");
const uploadRoutes = require("./uploadRoutes");
const dataRoutes = require("./dataRoutes");

const router = express.Router();

// Basic route
router.get("/", (req, res) => {
  res.json({
    message: "Server is running!",
    port: process.env.PORT || 5000,
  });
});

// Mount route modules directly to root for clean API
router.use("/", uploadRoutes);
router.use("/", dataRoutes);

module.exports = router;
