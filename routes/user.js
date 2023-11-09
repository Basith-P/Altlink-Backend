const express = require("express");
const { body } = require("express-validator");

const User = require("../models/user");
const userController = require("../controllers/user");

const userRouter = express.Router();

userRouter.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .normalizeEmail(),

    body("name").trim().not().isEmpty().withMessage("Name is required."),

    body("password")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 characters long."),
  ],
  userController.signup
);

module.exports = userRouter;
