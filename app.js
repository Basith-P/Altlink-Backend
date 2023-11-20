const path = require("path");

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();

require("./config/database").connect();

const isAuth = require("./middleware/is-auth");

const feedRouter = require("./routes/feed");
const authRouter = require("./routes/auth");

const app = express();
const port = process.env.PORT || 8080;

/// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "images"),
  filename: (req, file, cb) => cb(null, uuidv4() + "-" + file.originalname),
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif"];
  allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
  console.log("Mimetype:", file.mimetype);
};

/// Static Files
app.use(multer({ storage, fileFilter }).single("image"));
app.use("/images", express.static(path.join(__dirname, "images")));

/// Routes
app.use("/feed", isAuth, feedRouter);
app.use("/auth", authRouter);

/// Error Handling Middleware
app.use((error, req, res, next) => {
  console.log("Server Error:", error);

  const { statusCode, message, data } = error;
  res.status(statusCode || 500).json({ message, data });
});

app.listen(port, () => console.log(`Listening on port ${port}.`));
