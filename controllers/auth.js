const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const User = require("../models/user");

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const { email, name, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      const error = new Error("User already exists!");
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    user = new User({
      email,
      name,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      message: "User created successfully!",
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  console.log("Login route hit!");
  const { email, password } = req.body;
  console.log("Email:", email, "Password:", password);

  try {
    const user = await User.findOne({ email });
    console.log("User:", user);
    if (!user) {
      console.log("User with this email does not exist!");
      const error = new Error("User with this email does not exist!");
      error.statusCode = 401;
      throw error;
    }
    console.log("Pass", password, user.password);
    const isEqual = bcrypt.compare(password, user.password);
    if (!isEqual) throw (new Error("Wrong password!").statusCode = 401);

    const token = jwt.sign(
      {
        uid: user._id.toString(),
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: "success",
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};
