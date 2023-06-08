const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");
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

// GET/Display all posts
exports.post_list = async (req, res) => {
  try {
    // const posts = await Post.find()
    //   .populate("content")
    //   .populate("authorName")
    //   .populate("comments")
    //   .populate("likes")
    //   .populate("likeCount")
    //   .exec();

    const userId = req.user._id;

    // Get current user`s friends
    const currentUser = await User.findById(userId);
    const friends = currentUser.friends;

    // Add current user`s ID to the friend array
    friends.push(userId);

    // Find posts from current user and their friends
    const posts = await Post.find({ userId: { $in: friends } })
      .sort({ date: -1 })
      .populate("userId", "fullName")
      .populate("comments")
      .populate("likes")
      .exec();

    res.json({ message: "Success", posts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error retrieving posts" });
  }
};

// Update post
exports.post_update = [
  body("content").trim().notEmpty().withMessage("Content is required"),

  async (req, res) => {
    try {
      // Check for validation error
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Retrieve post id from params
      const postId = req.params.postId;

      // Find the post by id
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const postAuthor = await User.findById(req.user._id);

      // Update the post with the new data
      post.content = req.body.content;

      // Save the updated post to the database
      const updatedPost = await post.save();
      res.json({ message: "Post updated successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Error in updating post" });
    }
  },
];

// Delete post
exports.post_delete = async (req, res, next) => {
  try {
    const postId = req.params.postId;

    // Check if ID is valid
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Post id is invalid" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const author = await User.findById(post.userId);

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    // Remove post ID from user`s posts array
    author.posts.pull(postId);
    await author.save();

    await Post.findByIdAndRemove(postId);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
