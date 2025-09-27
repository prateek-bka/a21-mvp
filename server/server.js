const express = require("express");
const dotenv = require("dotenv");
const corsMiddleware = require("./middleware/cors");
const errorHandler = require("./middleware/errorHandler");
const routes = require("./routes");
const connectDB = require("./config/database");

// Load environment variables
dotenv.config();

const app = express();

// Connect to database
// connectDB();

// Middleware
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", routes);

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
