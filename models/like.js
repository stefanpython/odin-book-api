const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const likeSchema = new Schema({
  authorName: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
});

module.exports = mongoose.model("Like", likeSchema);
