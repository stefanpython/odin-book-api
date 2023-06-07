const User = require("../models/user");
const Like = require("../models/like");
const Post = require("../models/post");
const mongoose = require("mongoose");

exports.like_post = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const userId = req.user._id;

    // Check if ID is valid
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Post id is invalid" });
    }

    // Find the post and check if exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Chcek if user has already liked the post
    const existingLike = await Like.findOne({ user: userId, post: postId });

    if (existingLike) {
      // User has already liked the post, so remove the like
      await Like.findOneAndRemove({ user: userId, post: postId });

      // Remove like from user's likes array
      await User.findByIdAndUpdate(userId, {
        $pull: { likes: existingLike._id },
      });

      // Remove like from post's likes array
      await Post.findByIdAndUpdate(postId, {
        $pull: { likes: existingLike._id },
      });

      // Decrement likeCount of the post
      post.likeCount -= 1;
      await post.save();

      res.status(200).json({ message: "Post unliked successfully" });
    } else {
      // User has not liked the post, so create a new like
      const newLike = new Like({ user: userId, post: postId });
      await newLike.save();

      // Add like to user's likes array
      await User.findByIdAndUpdate(userId, { $push: { likes: newLike._id } });

      // Add like to post's likes array
      await Post.findByIdAndUpdate(postId, { $push: { likes: newLike._id } });

      // Increment likeCount of the post
      post.likeCount += 1;
      await post.save();

      res.status(200).json({ message: "Post liked successfully" });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};
