const User = require("../models/user");
const FriendRequest = require("../models/friendRequest");

// Send friend request
exports.send_request = async (req, res) => {
  try {
    const { senderId, recipientId } = req.body;

    // Check if the sender and recipient exist
    const sender = await User.findById(senderId);
    const recipient = await User.findById(recipientId);

    if (!sender || !recipient) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if recipient is already a friend of sender
    const isFriend = sender.friends.includes(recipientId);

    if (isFriend) {
      return res
        .status(400)
        .json({ message: "This user is already your friend" });
    }

    // Check if request already exists between sender and recipient
    const existingRequest = await FriendRequest.findOne({
      sender: senderId,
      recipient: recipientId,
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    // Create and save a new request
    const newRequest = new FriendRequest({
      sender: senderId,
      recipient: recipientId,
    });

    // Add request to the recipient`s friendRequests array
    recipient.friendRequests.push(newRequest);

    // Save the updated recipient and the new request
    await recipient.save();
    await newRequest.save();

    res.status(200).json({ message: "Friend request sent" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Accept friend request
exports.accept_request = async (req, res) => {
  const { friendRequestId } = req.body;

  try {
    // Find friend request by ID
    const request = await FriendRequest.findById(friendRequestId);
    if (!request) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    // Find sender and receviver users
    const sender = await User.findById(request.sender);
    const recipient = await User.findById(request.recipient);

    if (!sender || !recipient) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the friend request lists
    sender.friendRequests.pull(friendRequestId);
    recipient.friendRequests.pull(friendRequestId);

    // Add sender to the receviver`s friend list
    recipient.friends.push(sender._id);

    // Add recipient to the sender`s friend list
    sender.friends.push(recipient._id);

    // Save the updated sender and recipient
    await sender.save();
    await recipient.save();

    // Remove friend request
    await FriendRequest.findByIdAndDelete(friendRequestId);

    res.status(200).json({ message: "Friend request accepted" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get friend request list
exports.request_list = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "USer not found" });
    }

    const requestList = user.friendRequests;

    res
      .status(200)
      .json({ message: "Request list successfully retreived", requestList });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
