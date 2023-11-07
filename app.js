const path = require("path");

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const feedRoutes = require("./routes/feed");

const app = express();
const port = process.env.PORT || 8080;

/// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

/// Static Files
app.use("/images", express.static(path.join(__dirname, "images")));

/// Routes
app.use("/feed", feedRoutes);

/// Error Handling Middleware
app.use((error, req, res, next) => {
  console.log(error);
  const { statusCode, message, data } = error;
  res.status(statusCode || 500).json({ message, data });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB."))
  .catch((err) => console.log(err));

app.listen(port, () => console.log(`Listening on port ${port}.`));
