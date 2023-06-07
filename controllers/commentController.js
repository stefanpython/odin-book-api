const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const { body } = require("express-validator");
const mongoose = require("mongoose");

exports.comment_create = [
  body("content").trim().notEmpty().withMessage("Content must not be empty"),

  async (req, res, next) => {
    try {
      const { content } = req.body;
      const postId = req.params.postId;
      const userId = req.user._id;

      // Check if ID is valid
      if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ message: "Post id is invalid" });
      }

      // Check if post exists
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(400).json({ message: "Post not existent" });
      }

      // Create and save new comment
      const newComment = new Comment({
        content: content,
        post: postId,
        user: userId,
      });

      await newComment.save();

      // Add new comment to User`s comment array
      await User.findByIdAndUpdate(userId, {
        $push: { comments: newComment._id },
      });

      // Add new comment to Post`s comment array
      await Post.findByIdAndUpdate(postId, {
        $push: { comments: newComment._id },
      });

      res.status(200).json({ message: "Comment added successfully" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  },
];
