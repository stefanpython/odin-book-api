const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const Comment = require("../models/comment");
const Like = require("../models/like");
const Post = require("../models/post");
const bcrypt = require("bcryptjs");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// GET User profile
exports.user_profile = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId)
      .populate({
        path: "posts",
        populate: {
          path: "comments",
          select: "-__v",
        },
        select: "-__v",
      })
      .populate("friendRequests", "-__v")
      .populate("likes", "-__v")
      .populate("friends", "-__v")
      .populate("profileImg", "-__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Success", user });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// Edit User Profile
exports.profile_update = [
  (req, res, next) => {
    const uploadMiddleware = upload.single("image");
    uploadMiddleware(req, res, (err) => {
      if (err) {
        console.error("Error uploading file:", err);
        return res.status(400).json({ error: err.message });
      }
      console.log("File uploaded successfully");
      next();
    });
  },

  async (req, res) => {
    const userId = req.params.userId;
    const { firstName, lastName, email, password } = req.body;

    try {
      // Check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Handle profile image
      const profileImage = req.file ? req.file.filename : null;

      const updatedFields = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        profilePhoto: profileImage,
      };

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updatedFields.password = hashedPassword;
      }

      // Update user`s profile
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updatedFields },
        { new: true }
      );

      // Update users`s info in posts
      await Post.updateMany(
        { userId: userId },
        {
          $set: {
            authorName: updatedUser.fullName,
            profilePhoto: updatedUser.profilePhoto,
          },
        }
      );

      // Update user`s info in comments
      await Comment.updateMany(
        { user: userId },
        { $set: { authorName: updatedUser.fullName } }
      );

      // Update user`s info in likes
      await Like.updateMany(
        { user: userId },
        { $set: { authorName: updatedUser.fullName } }
      );

      res.json({ message: "Profile updated successfully!", updatedUser });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Error updating profile", error: err });
    }
  },
];
