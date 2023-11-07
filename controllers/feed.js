const { validationResult } = require("express-validator");

const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      res.status(200).json({
        message: "Fetched posts successfully.",
        posts,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    // error.data = errors.array();
    throw error;
  }

  const { title, content } = req.body;

  try {
    let imageUrl;
    if (req.file) {
      imageUrl = req.file.path.replace("\\", "/");
    }

    const post = new Post({
      title,
      content,
      imageUrl,
    });

    await post.save();

    res.status(201).json({
      message: "Post created successfully!",
      post,
    });
  } catch (error) {
    next(error);
  }
};

exports.getPostById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);

    if (!post) {
      const error = new Error("Could not find post.");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ post });
  } catch (error) {
    next(error);
  }
};
