const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const friendRequestSchema = new Schema({
  senderName: String,
  recipientName: String,
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("FriendRequest", friendRequestSchema);
