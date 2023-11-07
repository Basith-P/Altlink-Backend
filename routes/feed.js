const express = require("express");
const { body } = require("express-validator");

const feedController = require("../controllers/feed");

const router = express.Router();

router.get("/posts", feedController.getPosts);
router.post(
  "/posts",
  [
    body("title").trim().isLength({ min: 3 }),
    body("content").trim().isLength({ min: 3 }),
  ],
  feedController.createPost
);

module.exports = router;
