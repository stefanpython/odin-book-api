const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: { type: String, required: true },
  password: { type: String, required: true },
  profileImg: String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  friendRequests: [
    { type: mongoose.Schema.Types.ObjectId, ref: "FriendRequest" },
  ],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Like" }],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  profilePhoto: String,
});

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model("User", userSchema);
