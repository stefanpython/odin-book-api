const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  content: String,
  authorName: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Like" }],
  likeCount: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
  image: String,
  profilePhoto: String,
});

module.exports = mongoose.model("Post", postSchema);
