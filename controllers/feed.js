const fs = require("fs");

const { validationResult } = require("express-validator");

const Post = require("../models/post");
const path = require("path");

exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = req.query.perPage || 5;
  console.log(currentPage);

  try {
    const totalItems = await Post.find().countDocuments();

    const posts = await Post.find()
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    const hasMore = totalItems > currentPage * perPage;
    res.status(200).json({
      message: "Fetched posts successfully.",
      posts,
      totalItems,
      hasMore,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const { title, content } = req.body;

    let imageUrl;
    if (req.file) {
      imageUrl = req.file.path.replace("\\", "/");
    }

    const post = new Post({
      title,
      content,
      imageUrl,
      creator: req.userId,
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    throw error;
  }

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

exports.updatePost = async (req, res, next) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const post = await Post.findById(id);

    if (!post) {
      const error = new Error("Could not find post.");
      error.statusCode = 404;
      throw error;
    }

    if (req.file) {
      clearImage(post.imageUrl);
      post.imageUrl = req.file.path.replace("\\", "/");
    }

    if (title) post.title = title;
    if (content) post.content = content;

    await post.save();

    res.status(200).json({ post, message: "Post updated!" });
  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);

    if (!post) {
      const error = new Error("Could not find post.");
      error.statusCode = 404;
      throw error;
    }

    if (post.imageUrl) clearImage(post.imageUrl);

    await Post.findOneAndDelete(id);

    res.status(200).json({ message: "Post deleted!" });
  } catch (error) {
    next(error);
  }
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
