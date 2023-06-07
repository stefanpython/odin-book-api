const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const User = require("../models/user");
const Post = require("../models/post");
const Like = require("../models/like");
const Comment = require("../models/comment");

// GET User profile
exports.user_profile = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const populateFields = [
      "posts",
      "friendRequests",
      "comments",
      "likes",
      "friends",
    ];

    const populatedUser = await Promise.all(
      populateFields.map(async (field) => {
        const populatedField = await User.populate(user, {
          path: field,
          select: "-__v",
        });
        return populatedField;
      })
    );

    res.json({ message: "Success", user: populatedUser[0] });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
