const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: { type: String, required: true },
  password: { type: String, required: true },
  profileImg: String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  friendRequests: [
    { type: mongoose.Schema.Types.ObjectId, ref: "FriendRequest" },
  ],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Like" }],
});

module.exports = mongoose.model("User", userSchema);
