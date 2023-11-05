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
  const { title, content } = req.body;
  // Create post in db
  res.status(201).json({
    message: "Post created successfully!",
  });
};
