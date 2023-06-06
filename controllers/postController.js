const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const Post = require("../models/post");
const Like = require("../models/like");
const Comment = require("../models/comment");

// Create post
exports.post_create = [
  // Sanitize inputs
  body("content").trim().notEmpty().withMessage("Content is required"),
  //   body("comments").isArray().withMessage("Comments must be an array"),
  //   body("likes").isArray().withMessage("Likes must be an array"),

  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { content, comments, likes } = req.body;

      const postAuthor = await User.findById(req.user._id);

      // Create new post
      const newPost = new Post({
        content: content,
        userId: postAuthor,
        authorName: postAuthor.fullName,
      });

      // Save new post to database
      const savedPost = await newPost.save();

      // Add the post to the user's posts list
      postAuthor.posts.push(savedPost._id);
      await postAuthor.save();

      res.status(200).json({ message: "Post created successfully", savedPost });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error in creating post", error: err.message });
    }
  },
];
