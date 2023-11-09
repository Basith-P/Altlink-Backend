const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

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
