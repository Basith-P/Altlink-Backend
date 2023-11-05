const { validationResult } = require("express-validator/check");

exports.getPosts = (req, res, next) => {
  res.json({
    posts: [
      {
        title: "First Post",
        content: "This is the first post!",
      },
    ],
  });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation failed.",
      errors: errors.array(),
    });
  }

  const { title, content } = req.body;
  res.status(201).json({
    message: "Post created successfully!",
  });
};
